import type { TooltipPlacement } from 'antd/es/tooltip';

export interface HelpXPItem {
  title: string;
  content: string;
  context?: string;
  placement?: TooltipPlacement;
}

export const HELPXP_ITEMS: Record<string, HelpXPItem> = {
  'help-button': {
    title: 'AI Assistant',
    content: 'Opens the AI chat panel. Ask anything about the app.',
    context: 'The AI Assistant is a chat panel powered by a LangGraph agent. Users can open it by clicking the question mark icon in the sidebar footer. It supports streaming responses and can highlight UI elements contextually.',
    placement: 'right',
  },
  'theme-toggle': {
    title: 'Theme',
    content: 'Switch between light and dark mode.',
    context: 'The theme toggle in the sidebar footer switches between dark mode and light mode using Ant Design theme algorithms. The current state persists only for the session.',
    placement: 'right',
  },
  'add-user': {
    title: 'Add User',
    content: 'Create a new user record from this button.',
    context: 'The Add User button opens a form to create a new user. Required fields: Name, Email, Role (Admin/Editor/Viewer), Status (active/inactive). Submitting saves to the in-memory mock store.',
    placement: 'bottom',
  },
  'users-table': {
    title: 'Users List',
    content: 'Browse, search, edit and delete users from this table.',
    context: 'The Users List table shows all users with columns: Name (clickable link to edit), Email, Role (Admin/Editor/Viewer), Status (active = green, inactive = red), Created date (sortable). Edit via name link or pencil icon. Delete via trash icon with confirmation popover.',
    placement: 'top',
  },
};
