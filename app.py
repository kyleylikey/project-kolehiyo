import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize OpenAI client with API key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Questions for guided conversation
q1="What subjects or topics do you enjoy the most in school?"
q2="How would you describe your strengths or skills?"
q3="Do you already have a dream job or career in mind? If yes, what is it?"
q4="Would you prefer a course that is more practical and skill-based, or more academic and theory-based?"
q5="What are your long-term goals or priorities?"

questions = [q1, q2, q3, q4, q5]

# Prompt components
base_prompt="Provide and rank 5 college programs to take as a Filipino student. Indicate program name, short description(1-2 sentences), reasons, possible career paths "

def generate_response(user_message, conversation_history=None):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for Filipino students choosing college programs. Only send programs available in the Philippines. Format your responses in markdown for better readability."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating response: {e}")
        return f"Sorry, I encountered an error: {str(e)}"
    
# Track conversation state
user_responses = {
    "interest": "",
    "skills": "",
    "dreamjob": "",
    "coursepreference": "",
    "goals": "",
}
current_question = 0

@app.route('/api/chat', methods=['POST'])
def chat():
    global current_question
    data = request.json
    user_message = data.get('message', '')
    reset_conversation = data.get('reset', False)
    generating_recommendations = data.get('generating', False)

    if reset_conversation:
        current_question = 0
        user_responses["interest"] = ""
        user_responses["skills"] = ""
        user_responses["dreamjob"] = ""
        user_responses["coursepreference"] = ""
        user_responses["goals"] = ""

    # Handle the final recommendation generation
    if generating_recommendations:
        # All questions answered, generate final recommendation
        final_prompt = f"{base_prompt}\n" \
                      f"My interests: {user_responses['interest']}\n" \
                      f"My skills: {user_responses['skills']}\n" \
                      f"My dream job: {user_responses['dreamjob']}\n" \
                      f"My course preference: {user_responses['coursepreference']}\n" \
                      f"My goals: {user_responses['goals']}"
        
        response = generate_response(final_prompt)
        current_question = 0  # Reset for next conversation
        return jsonify({"response": response})

    # First message - start the conversation flow
    if current_question == 0:
        current_question = 1
        return jsonify({"response": questions[0]})
    
    # Store user responses and ask next question
    if current_question <= 5:
        if current_question == 1:
            user_responses["interest"] = user_message
        elif current_question == 2:
            user_responses["skills"] = user_message
        elif current_question == 3:
            user_responses["dreamjob"] = user_message
        elif current_question == 4:
            user_responses["coursepreference"] = user_message
        elif current_question == 5:
            user_responses["goals"] = user_message
            
            # Return a message indicating recommendations are coming
            return jsonify({"response": "Thank you for sharing! Based on your responses, I'm now generating personalized college program recommendations for you...", "needsRecommendations": True})
        
        # Ask next question
        current_question += 1
        return jsonify({"response": questions[current_question-1]})
    
    # Fallback for any other messages
    response = generate_response(user_message)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
