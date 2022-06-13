import React from "react";

import Cards from ".";

export default {
  component: Cards,
  title: "COOCHI-UI/Cards",
};

const Template = (args) => <Cards {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Default",
};