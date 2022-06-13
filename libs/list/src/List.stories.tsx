import React from "react";

import List from ".";

export default {
  component: List,
  title: "COOCHI-UI/List",
};

const Template = (args) => <List {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Default",
};