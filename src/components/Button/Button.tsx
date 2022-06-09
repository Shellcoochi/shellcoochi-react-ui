import React from "react";
import classNames from "classnames";

export interface IButtonProps {
  onClick?: () => void;
  primary?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Button = (props: IButtonProps) => {
  const {
    className: buttonClassName,
    style,
    onClick,
    children,
    primary,
  } = props;

  const className = classNames(
    {
      "coochi-button": true,
      "coochi-button-primary": primary,
    },
    buttonClassName
  );

  return (
    <button type="button" className={className} style={style} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
};
