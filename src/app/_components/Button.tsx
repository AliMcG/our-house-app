import { cva, type VariantProps } from "class-variance-authority";

/** The extends type "HTMLButtonElement" allows us to use any attributes that a <button> tag can have
 *  without having to explicitly define the arttibutes
 *  this is done by spreading the prop "...rest"
 * */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

/** Documentation on CVA - https://cva.style/docs/getting-started/variants
 * We can add or modfiy the "intent". For example to have "primary", "secondary" and "danger"
 * We can add or modfiy the "size". For example to have "small", "normal", "large" and "extra large"
 */
const buttonStyles = cva(
  "flex w-3/6 items-center justify-center rounded-lg font-semibold no-underline transition shadow-2xl shadow-slate-800",
  {
    variants: {
      intent: {
        primary: "text-white hover:bg-[#cdacec] bg-[#b372f0]",
        secondary: "text-slate-800 bg-white hover:bg-slate-200",
      },
      size: {
        small: "px-1 py-0.1",
        normal: "px-2 py-1",
        large: "px-5 py-3",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "normal",
    },
  },
);
export interface CombinedButtonProps
  extends ButtonProps,
    VariantProps<typeof buttonStyles> {}

const Button = ({ text, intent, size, ...rest }: CombinedButtonProps) => {
  return (
    <button className={buttonStyles({ intent, size })} {...rest}>
      {text}
    </button>
  );
};

export default Button;
