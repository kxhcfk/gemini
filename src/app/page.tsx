"use client";

import { useCallback, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Home() {
    const [value, setValue] = useState<string>("");
    const [height, setHeight] = useState<number>(0);
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    
    const handleTextAreaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        setHeight(0);
        setHeight(() => e.target.scrollHeight);
    }, []);
    
    const handleButtonClick = useCallback(async () => {
        setLoading(true);
        
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
        
        try {
            const model = genAI.getGenerativeModel({model: "gemini-pro"});
            
            const result = await model.generateContent(value);
            const response = await result.response;
            setResult(response.text());
            setLoading(false);
        } catch (e) {
            setError(true);
        }
    }, []);
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <textarea
                style={{height: height + "px"}}
                className="text-black bg-gray-100 block w-full p-4 rounded-xl shadow-2xl resize-none focus:outline-0 min-h-[12rem]"
                value={value} onChange={handleTextAreaChange} placeholder="Сколько людей на планете?"
            ></textarea>
            <div className="mt-10">
                <button
                    onClick={handleButtonClick}
                    disabled={loading}
                    className="px-6 py-3 text-xl bg-cyan-500 cursor-pointer rounded-xl text-white transition hover:bg-cyan-700 disabled:opacity-50 disabled:hover:bg-cyan-500"
                >Найти
                </button>
            </div>
            {result && (
                <div>{result}</div>
            )}
            {error && (
                <h1 className="text-xl my-2">Произошла ошибка</h1>
            )}
        </main>
    );
}
