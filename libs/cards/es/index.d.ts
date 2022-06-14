/// <reference types="react" />
import "./index.less";
export declare type IButtonProps = {
    onClick?: () => void;
    primary?: boolean;
    className?: string;
    style?: {};
    children?: any;
};
declare const Cards: (props: IButtonProps) => JSX.Element;
export default Cards;
