import { prisma } from "@/lib/prisma";
import { addProgramme, deleteProgramme } from "@/lib/admin-actions";

export default async function AdminProgrammesPage() {
  const programmes = await prisma.programme.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-primary">Programmes</h2>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
        <h3 className="font-semibold mb-4">Add Programme</h3>
        <form action={addProgramme} className="space-y-3">
          <input
            name="name"
            placeholder="Programme name"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            name="code"
            placeholder="Code (e.g., TH)"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-light"
          >
            Add Programme
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programmes.map((prog) => (
          <div key={prog.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{prog.name}</h3>
                <p className="text-sm text-gray-500">{prog.code}</p>
                <p className="text-sm text-gray-600">{prog.description}</p>
              </div>
              <form action={deleteProgramme}>
                <input type="hidden" name="id" value={prog.id} />
                <button className="text-red-600 hover:text-red-800">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}