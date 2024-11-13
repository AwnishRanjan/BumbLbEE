from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from llm_chains import load_normal_chain, load_pdf_chat_chain
from utils import get_timestamp
from database_operations import (
    save_text_message, load_last_k_text_messages, load_messages,
    get_all_chat_history_ids, delete_chat_history, init_db
)
from pdf_handler import add_documents_to_db
from audio_handler import transcribe_audio  
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to match your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()
pdf_chat_enabled = False

@app.post("/toggle_pdf_chat/")
async def toggle_pdf_chat(enabled: bool):
    global pdf_chat_enabled
    pdf_chat_enabled = enabled
    return {"message": f"PDF Chat mode is now {'enabled' if enabled else 'disabled'}"}

@app.post("/upload/pdf/")
async def upload_pdf(files: list[UploadFile]):
    pdfs_bytes_list = []
    for file in files:
        pdf_data = await file.read()
        pdfs_bytes_list.append(pdf_data)
    add_documents_to_db(pdfs_bytes_list)
    global pdf_chat_enabled
    pdf_chat_enabled = True
    return {"message": "PDFs processed and added to the database successfully. PDF chat is now enabled."}

@app.post("/upload/audio/")
async def upload_audio(audio: UploadFile = File(...)):
    audio_data = await audio.read()
    transcribed_text = transcribe_audio(audio_data)
    session_key = "your_session_key_here"  # Replace with actual session key handling
    save_text_message(session_key, "human", transcribed_text)
    return {"message": "Audio file uploaded and transcribed successfully", "transcription": transcribed_text}

@app.post("/chat/")
async def chat(user_input: str = Form(...), session_key: str = Form(...), audio_file: UploadFile = File(None)):
    chat_history = load_last_k_text_messages(session_key, 10)
    
    if audio_file:
        audio_data = await audio_file.read()
        user_input = transcribe_audio(audio_data)
    
    if pdf_chat_enabled:
        llm_chain = load_pdf_chat_chain()
    else:
        llm_chain = load_normal_chain()
    
    llm_answer = llm_chain.run(user_input=user_input, chat_history=chat_history)
    save_text_message(session_key, "human", user_input)
    save_text_message(session_key, "ai", llm_answer)

    return JSONResponse(content={"response": llm_answer})

@app.get("/chat/history/")
async def get_chat_history(session_key: str):
    chat_history = load_messages(session_key)
    return JSONResponse(content={"chat_history": chat_history})

@app.get("/sessions/")
async def get_chat_sessions():
    chat_sessions = get_all_chat_history_ids()
    return JSONResponse(content={"chat_sessions": chat_sessions})

@app.delete("/session/")
async def delete_session(session_key: str):
    delete_chat_history(session_key)
    return JSONResponse(content={"message": "Session deleted successfully."})

@app.post("/new_session/")
async def new_session():
    session_key = get_timestamp()
    return JSONResponse(content={"session_key": session_key})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
