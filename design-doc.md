# 🎓 Project Kolehiyo
Your AI-powered college decision buddy for Filipino senior high school students.

## 🎯 Objectives
The project aims to guide incoming freshmen in choosing their college program and lessen the pressure they get in making their choice.

It specifically aims to:
1. Develop a responsive and user-friendly web application
2. Integrate an OpenAI-powered chatbot to simulate helpful and personalized career guidance
3. Provide informed and relevant program suggestions based on the user's background, interests, and strengths

## 👥 Target Users
The project targets all, but not limited to, incoming college students, specifically graduating senior high school students.

A lot of incoming college students struggle to choose their path for a variety of reasons:
1. Lack of access to proper career guidance
2. Uncertainty about how their interests and strengths align with college programs
3. Peer or family pressure to pursue a specific course
4. Overwhelming number of options with little understanding of what each course entails

Project Kolehiyo aims to serve as a digital guidance companion—easy to access, conversational, and personalized to the student's unique background.

## 🧱 Features / Functional Requirements
- **User Input:** Users are prompted several questions about their interests, background, strengths, and lifelong goals
- **AI-Powered Recommendations:** Chatbot generates at most 5 college programs
- **Prograam Descriptions:** Chatbot provides brief descriptions of each recommended college program, including career paths
- **Responsive Design:** Web app should adjusts to work on different devices, from desktop to mobile

## 🧠 Program Flow / Logic
1. User initiates the chat with a "Start Chat" button
2. User is prompted with a series of questions about interests, background, strengths, and lifelong goals
   > Note: The questions are designed to be directly relevant to the college program recommendations, ensuring that only necessary data is collected for the purpose of generating tailored advice.
3. Chatbot uses OpenAI to generate up to 5 college program recommendations based on the inputs from the user

## 🗃️ Data Structures
This project uses simple data structures suited for a lightweight chatbot web app.
- **Lists:**
Used to store the sequence of user prompts and responses for managing the chat history and feeding it into the OpenAI API.
- **Dictionaries:**
Each message in the OpenAI conversation is structured as a dictionary with role and content.
  > Example: {"role": "user", "content": "I like science and solving problems."}
- **JSON Files (Optional):**
For storing sample question sets or test data. This keeps the format structured and readable.

## 🔧 Technologies and Tools
**Python Version:** Python 3.10+
**Libraries:**
- openai — for interacting with the ChatGPT API
- streamlit — for building a simple web interface
- json — for formatting/storing data (if needed)
- dotenv — for managing the API key securely
  
**Editors / Platforms:**
- Visual Studio Code (VS Code)
- GitHub — for version control and sharing the code
**Deployment:** Render

## 🧪 Testing Plan
To ensure the program works as intended:
- **Functional Testing:**
  - Test if the chatbot responds to various user profiles (e.g. science-inclined, arts-inclined, undecided).
  - Verify that recommendations align with input.
- **Edge Case Testing:**
  - Empty or vague inputs (e.g. “idk”)
  - Extremely long inputs
  - Repeated answers
- **User Experience:**
  - Make sure prompts are clear and not overwhelming.
  - Ensure chatbot responses are not too generic.

## 🚧 Limitations
- **API Dependence:** Requires internet connection and relies on OpenAI’s API service, which may be subject to availability or quota limits.
- **Token Limits:** There’s a cap to how much data can be processed in one interaction (e.g., 16,385 tokens for gpt-3.5-turbo), which could affect long sessions.
- **No User Accounts:** The current version doesn't store user sessions or allow them to revisit past chats.
- **Generalized Suggestions:** Since the model isn’t locally trained on PH-specific course data, some recommendations may be broad or less localized.
- **Cloud Deployment:** The web app is hosted using a free-tier deployment platform, which can result in:
   - Limited uptime (may "sleep" after inactivity)
   - Slower loading times
   - Resource constraints like memory, storage, or concurrent user caps

## 💡 Recommendations for Improvement
- Incorporate a database to store user profiles or past recommendations for a more personalized experience.
- Use a Philippine course dataset to fine-tune responses or narrow suggestions to local institutions and program names.
- Add a feedback form for users to rate how helpful the recommendation was, improving future versions.
- Enable multi-language support, especially in Filipino, to make it more accessible to a wider student base.
- Create a mobile version of the app using tools like Streamlit or Flask + Bootstrap for better accessibility.
