// src/components/LinksComunicacao.jsx
import { ConnectivityLink } from './ConnectivityLink';
export function LinksComunicacao({ dados, statusLinks, toggleLink }) {
return (
<div className="container-fluid px-4 mt-4">
<h4 className="fw-light text-info border-bottom border-secondary pb-2 mb-4">Monitoramento de
Conectividade</h4>
<div className="row">
{dados.map(item => <ConnectivityLink key={item.id} item={item} isOnline={statusLinks[item.id]} onToggle={toggleLink} />)}
</div>
</div>
);
}