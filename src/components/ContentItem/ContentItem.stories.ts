import { Meta, StoryObj } from '@storybook/react';
import { ContentItem } from './ContentItem'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'ContentItem',
    component: ContentItem,
    parameters: {
      // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
      layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        title: {
            control: 'text',
            description: 'title'
        }
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    // args: { onClick: fn() },
  } satisfies Meta<typeof ContentItem>;
  
  export default meta;
  type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        title: "Women and Software-Defined Vehicles: Shaping the Female future of mobility"
    },
  };