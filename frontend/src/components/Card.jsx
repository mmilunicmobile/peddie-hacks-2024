export default function Card({ children, borderStyle = "bg-secondary border-primary" }) {
    return (
        <div className="w-full h-full pr-[5px] pb-[5px]">
            <div className={`rounded-lg flex flex-col border-2 w-full h-full overflow-hidden ${borderStyle}`} style={{
                filter: "drop-shadow(5px 5px #000000)",
            }}>
                {children}
            </div></div>
    );
}