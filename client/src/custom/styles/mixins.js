import { bgBlur } from "./bgBlur";

export function paper({ dropdown }) {
  return {
    ...bgBlur({
      color: "rgba(28, 37, 46, 0.9)",
      blur: 20,
    }),
    position: "absolute",
    outline: "0px",
    backgroundImage:
      "url(https://assets.minimals.cc/public/assets/core/cyan-blur.png), url(https://assets.minimals.cc/public/assets/core/red-blur.png)",
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundPosition: "right top, left bottom",
    backgroundSize: "50%, 50%",
    boxShadow:
      "rgba(0, 0, 0, 0.24) 0px 0px 2px 0px, rgba(0, 0, 0, 0.24) -20px 20px 40px -4px",
    ...(dropdown && {
      padding: "4px",
      boxShadow:
        "0 0 2px 0 rgba(0 0 0 / 0.24),-20px 20px 40px -4px rgba(0 0 0 / 0.24)",
      borderRadius: "10px",
    }),
  };
}
