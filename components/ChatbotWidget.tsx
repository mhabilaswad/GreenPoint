import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Maximize } from "lucide-react";

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState("User");
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        setChatHistory([`AI: Hello ${userName}, I am GreenPoint AI. You can ask me questions about your plants!`]);
    }, [userName]);

    // Reset fullscreen saat chat ditutup
    useEffect(() => {
        if (!isOpen) {
            setIsFullscreen(false);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMsg = message;
        setChatHistory((prev) => [...prev, `You: ${userMsg}`]);
        setMessage("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userMessage: userMsg }),
            });

            const data = await res.json();
            const aiReply = data.choices?.[0]?.message?.content || "AI tidak dapat merespons.";
            setChatHistory((prev) => [...prev, `AI: ${aiReply}`]);
        } catch (err) {
            setChatHistory((prev) => [...prev, "AI: Gagal menghubungi server."]);
        } finally {
            setIsLoading(false);
        }
    };

    function formatMessage(msg: string) {
        // Ganti **text** jadi <strong>text</strong>
        const boldParsed = msg.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        // Ganti newline (\n) jadi <br/>
        const lineBreakParsed = boldParsed.replace(/\n/g, "<br/>");
        return { __html: lineBreakParsed };
    }


    return (
        <div
            className={`fixed z-50 ${isFullscreen
                    ? "inset-0 flex items-center justify-center bg-black bg-opacity-70"
                    : "bottom-6 right-6"
                }`}
        >
            {isOpen ? (
                <Card
                    className={`rounded-2xl shadow-xl border relative bg-background text-foreground ${isFullscreen ? "w-11/12 max-w-4xl h-[80vh]" : "w-80"
                        }`}
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Tutup chat"
                        className="absolute top-2 right-2 opacity-60 hover:opacity-100 transition"
                    >
                        <X size={20} />
                    </button>

                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        aria-label={isFullscreen ? "Kecilkan tampilan" : "Perbesar tampilan"}
                        className="absolute top-2 right-10 opacity-60 hover:opacity-100 transition"
                    >
                        <Maximize size={20} />
                    </button>

                    <CardContent className="pt-6 pb-4 px-4 flex flex-col gap-3">
                        <div className="text-base font-semibold">GreenPoint AI</div>

                        <div
                            className="overflow-y-auto rounded border px-2 py-1 text-sm bg-black"
                            style={{
                                height: isFullscreen ? "50vh" : "12rem",
                                fontSize: isFullscreen ? "1.125rem" : "0.875rem"
                            }}
                        >
                            {chatHistory.length === 0 ? (
                                <div className="italic text-xs text-center mt-16 text-muted-foreground">
                                    Loading...
                                </div>
                            ) : (
                                <>
                                    {chatHistory.map((msg, i) => {
                                        const isUser = msg.startsWith("You:");
                                        return (
                                            <div
                                                key={i}
                                                className="mb-3 whitespace-pre-wrap"
                                                style={{
                                                    color: isUser ? "#FFFFFF" : "#4CAF50",
                                                }}
                                                dangerouslySetInnerHTML={formatMessage(msg)}
                                            />

                                        );
                                    })}
                                    {isLoading && (
                                        <div className="italic text-xs text-muted-foreground">AI is typing...</div>
                                    )}
                                </>
                            )}
                        </div>

                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            rows={2}
                            style={{ resize: "none", color: "#FFF", backgroundColor: "#222" }}
                        />

                        <Button onClick={handleSend} disabled={!message.trim() || isLoading}>
                            {isLoading ? "Loading..." : "Send"}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsOpen(true)}
                    className="rounded-full shadow-lg border border-border hover:scale-105 transition"
                    aria-label="Open chat"
                >
                    <MessageCircle size={20} />
                </Button>
            )}
        </div>
    );
}