import { Metadata } from 'next';
import { metadata } from './metadata';
import StructuredDataScript from '../components/StructuredDataScript';

export { metadata };

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredDataScript data={metadata.other?.['structured-data']} />
      {children}
    </>
  );
}