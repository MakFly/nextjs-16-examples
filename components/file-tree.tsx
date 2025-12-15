import { FolderIcon, FileIcon } from 'lucide-react';

const fileTreeData = [
  { name: 'app', type: 'folder', level: 0 },
  { name: 'layout.tsx', type: 'file', level: 1 },
  { name: 'page.tsx', type: 'file', level: 1 },
  { name: 'loading.tsx', type: 'file', level: 1 },
  { name: 'error.tsx', type: 'file', level: 1 },
  { name: 'not-found.tsx', type: 'file', level: 1 },
  { name: 'blog', type: 'folder', level: 1 },
  { name: 'layout.tsx', type: 'file', level: 2 },
  { name: 'page.tsx', type: 'file', level: 2 },
  { name: '[slug]', type: 'folder', level: 2 },
  { name: 'page.tsx', type: 'file', level: 3 },
  { name: 'loading.tsx', type: 'file', level: 3 },
  { name: 'category', type: 'folder', level: 2 },
  { name: '[category]', type: 'folder', level: 3 },
  { name: 'page.tsx', type: 'file', level: 4 },
  { name: 'dashboard', type: 'folder', level: 1 },
  { name: 'layout.tsx', type: 'file', level: 2 },
  { name: 'page.tsx', type: 'file', level: 2 },
  { name: 'loading.tsx', type: 'file', level: 2 },
  { name: 'error.tsx', type: 'file', level: 2 },
  { name: 'analytics', type: 'folder', level: 2 },
  { name: 'page.tsx', type: 'file', level: 3 },
  { name: 'users', type: 'folder', level: 2 },
  { name: 'page.tsx', type: 'file', level: 3 },
  { name: '[id]', type: 'folder', level: 3 },
  { name: 'page.tsx', type: 'file', level: 4 },
  { name: 'edit', type: 'folder', level: 4 },
  { name: 'page.tsx', type: 'file', level: 5 },
];

export function FileTree() {
  return (
    <div className="bg-muted rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
      {fileTreeData.map((item, index) => (
        <div
          key={index}
          className="flex items-center py-1"
          style={{ paddingLeft: `${item.level * 20}px` }}
        >
          {item.type === 'folder' ? (
            <FolderIcon className="h-4 w-4 mr-2 text-blue-600" />
          ) : (
            <FileIcon className="h-4 w-4 mr-2 text-gray-600" />
          )}
          <span className={item.type === 'folder' ? 'font-semibold text-blue-600' : ''}>
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}