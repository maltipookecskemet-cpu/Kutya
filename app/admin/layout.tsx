import {Nav} from '@/components/Nav';
export default function AdminLayout({children}:{children:React.ReactNode}){return <div className="shell"><Nav/><main className="main">{children}</main></div>}
