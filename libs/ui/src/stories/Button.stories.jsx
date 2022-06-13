import React from "react";

import { Button } from "../components/Button";
import "../styles/button.less";

export default {
  component: Button,
  title: "COOCHI-UI/Button",
};

const Template = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Default",
};