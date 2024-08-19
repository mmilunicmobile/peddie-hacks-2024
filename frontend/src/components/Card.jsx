// Creates a simple card with box shadow that is the base of most of the layout
export default function Card({ children, borderStyle = "bg-secondary border-primary" }) {
    return (
        <div className="w-full h-full pr-[5px] pb-[5px]">
            <div className={` flex flex-col border-2 w-full h-full overflow-hidden ${borderStyle}`} style={{
                boxShadow: "7px 7px 0px 0px #000000",
            }}>
                {children}
            </div></div>
    );
}