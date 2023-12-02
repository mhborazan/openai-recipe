import dotenv from "dotenv";
dotenv.config();
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";

const openAIApiKey = process.env.OPENAI_API_KEY;
const embeddings = new OpenAIEmbeddings({ openAIApiKey });
const sbApiKey = process.env.SUPABASE_API_KEY;
const sbUrl = process.env.SUPABASE_URL;
const client = createClient(sbUrl, sbApiKey);

const path = "./documents/";
const directoryLoader = new DirectoryLoader(path, {
  ".txt": (path) => new TextLoader(path),
});
const splitter = new CharacterTextSplitter({
  separator: ["Tarif\r\n"],
  keepSeparator: false,
  chunkSize: 300,
});

(async () => {
  const loaded_docs = await directoryLoader.load();
  const text = await splitter.splitDocuments(loaded_docs);
  console.log(text);
  const vectorStore = await SupabaseVectorStore.fromDocuments(
    text,
    embeddings,
    {
      client,
    }
  );
})();
