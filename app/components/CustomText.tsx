import React from "react";
import { Text, TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  weight?: "light" | "regular" | "medium" | "semibold" | "bold";
}

export const CustomText = ({
  weight = "regular",
  style,
  ...props
}: CustomTextProps) => {
  const getFontFamily = () => {
    switch (weight) {
      case "light":
        return "Inter-Light";
      case "medium":
        return "Inter-Medium";
      case "semibold":
        return "Inter-SemiBold";
      case "bold":
        return "Inter-Bold";
      default:
        return "Inter-Regular";
    }
  };

  return <Text {...props} style={[{ fontFamily: getFontFamily() }, style]} />;
};

export { CustomText as Text };
