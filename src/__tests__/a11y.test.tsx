import React from 'react';
import { render, act } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { Button, Modal, Tabs, TabsList, TabsTrigger, TabsContent, Progress } from '../components/ui';

expect.extend(matchers);

describe('UI Accessibility', () => {
  test('Button should not have basic a11y violations', async () => {
    const { container } = render(<Button>Test Button</Button>);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  test('Tabs should not have basic a11y violations', async () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  test('Progress should not have basic a11y violations', async () => {
    const { container } = render(<Progress value={50} max={100} />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  test('Modal should not have basic a11y violations', async () => {
    // Portal makes it tricky, let's render it directly without portal if we could, 
    // but we'll render it and check base.body.
    render(<Modal isOpen={true} onClose={() => {}} title="Test Modal">Content</Modal>);
    const results = await axe(document.body);
    
    expect(results).toHaveNoViolations();
  });
});
