/* eslint-disable no-console */
import { loadContentIndex } from "../src/content/content-loader";

const validate = () => {
  const { errors, index } = loadContentIndex();

  if (errors.length > 0) {
    console.error("\n❌ Content validation failed:\n");
    for (const error of errors) {
      console.error(`  [${error.folder}] ${error.message}`);
    }
    console.error("");
    process.exit(1);
  }

  console.log(`✅ Content is valid: ${index.pages.length} page(s)`);
};

validate();
