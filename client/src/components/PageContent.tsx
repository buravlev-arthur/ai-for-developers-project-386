import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function PageContent({ children }: Props) {
  return (
    <div
      style={{
        minHeight: 'calc(80vh - 64px)',
        paddingTop: 24,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  );
}
