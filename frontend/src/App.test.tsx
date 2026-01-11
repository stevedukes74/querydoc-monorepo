import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import App from './App';

describe('App', () => {
  it('renders the QueryDoc title', () => {
    render(<App />);
    expect(screen.getByText('QueryDoc')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<App />);
    expect(screen.getByText('Ask questions about your documents')).toBeInTheDocument();
  });

  it('renders the file upload button', () => {
    render(<App />);
    expect(screen.getByText('Choose PDF Document')).toBeInTheDocument();
  });

  it('does not render the chat interface at first', () => {
    render(<App />);
    expect(screen.queryByText(/Chat about:/)).not.toBeInTheDocument();
  });

  it('shows chat interface after selecting a file', async () => {
    render(<App />);

    // Create a fake PDF file
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

    // Get the file input. It's actually hidden
    const input = document.querySelector('#file-upload') as HTMLInputElement;

    // Simulate file selection
    await userEvent.upload(input, file);

    // Chat interface should appear
    expect(screen.getByText('Selected: test.pdf')).toBeInTheDocument();
    expect(screen.getByText('Chat about: test.pdf')).toBeInTheDocument();
  });

  it('changes button text after file is selected', async () => {
    render(<App />);

    // Confirm initial button text
    expect(screen.getByText('Choose PDF Document')).toBeInTheDocument();

    // Create a fake PDF file
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

    // Get the file input. It's actually hidden
    const input = document.querySelector('#file-upload') as HTMLInputElement;

    // Simulate file selection
    await userEvent.upload(input, file);

    // New button text should appear
    expect(screen.getByText('Change Document')).toBeInTheDocument();
    // Initial button text should no longer be present
    expect(screen.queryByText('Choose PDF Document')).not.toBeInTheDocument();
  });

  it('shows error for non-pdf files', async () => {
    // Mock window.alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });

    render(<App />);

    // Create a fake non-pdf file
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const input = document.querySelector('#file-upload') as HTMLInputElement;

    // Manually set the files property and trigger change event
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    // Fire the input change event
    input.dispatchEvent(new Event('change', { bubbles: true }));

    // Wait for the handler to run
    await new Promise(resolve => setTimeout(resolve, 0));

    // Should show alert
    expect(alertMock).toHaveBeenCalledWith('Please select a PDF file');

    // Chat interface should not appear
    expect(screen.queryByText(/Chat about:/)).not.toBeInTheDocument();

    // Restore the original alert
    alertMock.mockRestore();
  });
});