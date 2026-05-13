import type { TooltipPlacement } from 'antd/es/tooltip';

export interface HelpXPItem {
  title: string;
  content: string;
  placement?: TooltipPlacement;
}

export const HELPXP_ITEMS: Record<string, HelpXPItem> = {
  'help-button':  { title: 'AI Assistant', content: 'Opens the AI chat panel. Ask anything about the app.',        placement: 'right' },
  'theme-toggle': { title: 'Theme',         content: 'Switch between light and dark mode.',                         placement: 'right' },
  'add-user':     { title: 'Add User',      content: 'Create a new user record from this button.',                  placement: 'bottom' },
  'users-table':  { title: 'Users List',    content: 'Browse, search, edit and delete users from this table.',      placement: 'top' },
};
