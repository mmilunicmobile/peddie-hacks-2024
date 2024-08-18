export default function CardInset({ children, borderStyle = "bg-secondary border-primary" }) {
    return (
        <div className="w-full h-full">
            <div className={`flex flex-col border-2 w-full h-full overflow-hidden ${borderStyle} overflow-hidden pt-[5px] pl-[5px]`} style={{
                boxShadow: "inset 7px 7px 0px 0px #000000",
            }}>
                {children}
            </div></div>
    );
}