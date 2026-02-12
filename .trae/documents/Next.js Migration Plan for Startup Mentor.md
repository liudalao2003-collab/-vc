I will reconstruct your single-file React project into a standard Next.js (App Router) application.

### **Project Structure Plan**

I will create the following files in your project directory:

1.  **`package.json`**: Define dependencies (`next`, `react`, `openai`, `lucide-react`, `tailwindcss`, etc.).
2.  **`tsconfig.json` & `next.config.js`**: TypeScript and Next.js configuration.
3.  **`tailwind.config.ts` & `postcss.config.js` & `app/globals.css`**: Tailwind CSS setup to support your existing styling.
4.  **`app/layout.tsx`**: The root layout definition.
5.  **`app/page.tsx`**: The main entry page, which will render the refactored business logic.
6.  **`components/StartupMentor.tsx`**:
    *   This will contain your original business logic and UI from `React源代码`.
    *   **Refactoring**: I will replace the direct Google Gemini API calls with calls to your new internal API (`/api/generate`).
    *   **Logic**: Prompt construction and state management will remain unchanged.
7.  **`app/api/generate/route.ts`**:
    *   **Security**: This secure backend route will handle all AI requests.
    *   **Implementation**: It will accept a prompt from the client, call the **DeepSeek V3** API (via OpenAI SDK) using `process.env.DEEPSEEK_API_KEY`, and return the response.

### **Implementation Steps**

1.  **Initialize Project Configs**: Create standard Next.js configuration files.
2.  **Create API Route**: Implement `app/api/generate/route.ts` to bridge the client and DeepSeek.
3.  **Migrate & Refactor Code**:
    *   Move the existing React code into `components/StartupMentor.tsx`.
    *   Create a helper function `callAI` to replace the `fetch` calls to Google's API.
    *   Update the response parsing logic to handle the clean text output from the new API.
4.  **Setup Pages**: Create `app/page.tsx` to host the component.

This approach ensures your **business logic remains intact** while meeting the **architecture** and **security** requirements.