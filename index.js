import dotenv from "dotenv";
dotenv.config();

import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { StringOutputParser } from "langchain/schema/output_parser";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

const openAIApiKey = process.env.OPENAI_API_KEY;
const sbApiKey = process.env.SUPABASE_API_KEY;
const sbUrl = process.env.SUPABASE_URL;
const embeddings = new OpenAIEmbeddings({ openAIApiKey });
const client = createClient(sbUrl, sbApiKey);
const vectorStore = new SupabaseVectorStore(embeddings, { client });
const retriver = vectorStore.asRetriever({ k: 1 });

const llm = new ChatOpenAI({
  openAIApiKey,
  verbose: false,
  modelName: "gpt-3.5-turbo-1106",
});

const userQuestion =
  "Misafirlerim gelecek ve ne yapacağımı bilmiyorum. Onlara lezzetli bir tatlı ikram etmek istiyorum. Muzlu puding nasıl yapabilirim?";

const standaloneQuestionTemplate =
  "Given a question, convert it to a standalone question without removing ingredients. It'll be about recipes.  question: {question} standalone question:";
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate
);

const answerTemplate = `Bir dostane ve hevesli yemek tarifi uzmanı rolünü benimseyin,
 tüm beceri seviyeleri için detaylı, kişiye özel tarifler ve açık pişirme teknikleri sağlamaya odaklanın.
  Verilen bağlama bakarak cevap oluştur. Aşağıdaki bağlamı kullan. Malzemeler hakkında bilgiler sunun,
   çeşitli diyet ihtiyaçlarını ele alın ve kullanıcıların mutfak bilgisini ilginç gerçeklerle zenginleştirin.
    Yanıtları kişiselleştirin, denemeleri teşvik edin ve pişirme ipuçları paylaşın. Gıda güvenliğini koruyun,
     kültürel duyarlılığı gösterin ve sağlıklı yemeyi teşvik edin.
      Tarif paylaşımını teşvik ederek topluluk ruhu oluşturun ve sürekli iyileştirme için kullanıcı geri bildirimlerini entegre edin.
      Chat geçmişindeki verileri de dikkate al. Soru yemek tarifi ile ilgili değilse normal bir arkadaş gibi sohbet et
      ve kullanıcıyı yemek tarifi isteemsi için teşvik et.
----------------
Chat Geçmişi: {chatHistory}
----------------
Bağlam: {context}
----------------
soru: {question}
----------------
Cevap:`;
const answerPropmt = PromptTemplate.fromTemplate(answerTemplate);

const standaloneQuestionChain = standaloneQuestionPrompt
  .pipe(llm)
  .pipe(new StringOutputParser())
  .pipe(retriver);

const answerChain = answerPropmt.pipe(llm).pipe(new StringOutputParser());

const run = async (question, chatHistory) => {
  const response = await standaloneQuestionChain.invoke({
    question: question,
  });
  let context = response[0].pageContent;
  console.log(context);
  const aiResponse = await answerChain.invoke({
    context,
    question: question,
    chatHistory: chatHistory,
  });
  console.log(aiResponse);
  return aiResponse;
};

export default run;
