import React from "react";
import classNames from "classnames";
import './index.less';

export type IButtonProps = {
  onClick?: () => void;
  primary?: boolean;
  className?: string;
  style?: {};
  children?: any;
//   style?: React.CSSProperties;
//   children?: React.ReactNode;
}

const Cards = (props: IButtonProps) => {
  const {
    className: buttonClassName,
    style,
    onClick,
    children,
    primary,
  } = props;

  const className = classNames(
    {
      "coochi-cards": true,
      "coochi-cards-primary": primary,
    },
    buttonClassName
  );

  return (
    <button type="button" className={className} style={style} onClick={onClick}>
        <h1>卡片</h1>
      <span>{children}</span>
    </button>
  );
};

export default Cards;