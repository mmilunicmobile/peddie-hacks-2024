export default function Card({ children }) {
    return (
        <div className="w-full h-full pr-[5px] pb-[5px]">
            <div className="rounded-2xl bg-secondary flex flex-col border-2 border-primary w-full h-full overflow-hidden" style={{
                filter: "drop-shadow(5px 5px #000000)",
            }}>
                {children}
            </div></div>
    );
}