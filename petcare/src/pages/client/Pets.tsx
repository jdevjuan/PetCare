import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, PawPrint, Plus, Trash2 } from 'lucide-react';
import { Button, Card, EmptyState, PageHeader } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { deletePet, listPets } from '../../lib/api';
import type { PetView } from '../../lib/api';
import { ageText, errorMessage, homeFor } from '../../lib/format';

// Lista de animais: o cliente vê só os seus; o administrador vê todos.
export default function Pets() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [pets, setPets] = useState<PetView[]>(() => listPets());
  const isAdmin = user?.role === 'ADMIN';
  const base = user ? homeFor(user.role) : '/app';

  const handleDelete = (pet: PetView) => {
    if (!window.confirm(`Excluir ${pet.name}?`)) return;
    try {
      deletePet(pet.id);
      setPets(listPets());
      notify('success', 'Animal excluído.');
    } catch (error) {
      notify('error', errorMessage(error));
    }
  };

  return (
    <>
      <PageHeader
        title={isAdmin ? 'Animais' : 'Meus animais'}
        subtitle={isAdmin ? 'Todos os animais cadastrados na clínica.' : 'Cadastre e gerencie seus pets.'}
        action={
          <Link to={`${base}/animais/novo`}>
            <Button>
              <Plus className="h-4 w-4" /> Novo animal
            </Button>
          </Link>
        }
      />

      {pets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="Nenhum animal cadastrado"
          text="Cadastre um animal para poder agendar serviços."
          action={
            <Link to={`${base}/animais/novo`}>
              <Button>Cadastrar animal</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {pets.map((pet) => (
            <Card key={pet.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <PawPrint className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{pet.name}</p>
                    <p className="text-sm text-slate-500">
                      {pet.species}
                      {pet.breed ? ` - ${pet.breed}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Link
                    to={`${base}/animais/${pet.id}`}
                    aria-label={`Editar ${pet.name}`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-teal-50 hover:text-teal-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(pet)}
                    aria-label={`Excluir ${pet.name}`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-slate-400">Idade</dt>
                  <dd className="font-medium text-slate-700">{ageText(pet.birthDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Peso</dt>
                  <dd className="font-medium text-slate-700">{pet.weight ? `${pet.weight} kg` : '-'}</dd>
                </div>
                {isAdmin && (
                  <div className="col-span-2">
                    <dt className="text-xs text-slate-400">Tutor</dt>
                    <dd className="font-medium text-slate-700">{pet.ownerName}</dd>
                  </div>
                )}
              </dl>
              {pet.observations && <p className="mt-3 text-sm text-slate-500">{pet.observations}</p>}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
