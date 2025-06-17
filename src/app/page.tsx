"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

type Cuota = {
  mes: number;
  capital: number;
  interes: number;
  total: number;
  saldo: number;
};

export default function SimuladorPrestamo() {
  const [monto, setMonto] = useState(10000);
  const [plazo, setPlazo] = useState(12);
  const [interesAnual, setInteresAnual] = useState(24);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const resultadoRef = useRef<HTMLDivElement>(null);

  const interesMensual = interesAnual / 12 / 100;
  const totalInteres = monto * interesMensual * plazo;
  const totalPagar = monto + totalInteres;
  const cuotaMensual = totalPagar / plazo;

  const formatear = (valor: number) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(valor);

  const generarTablaAmortizacion = () => {
    const nuevasCuotas: Cuota[] = [];
    let saldoPendiente = monto;
    const capitalPorMes = monto / plazo;

    for (let mes = 1; mes <= plazo; mes++) {
      const interesMes = saldoPendiente * interesMensual;
      const totalMes = capitalPorMes + interesMes;
      saldoPendiente -= capitalPorMes;

      nuevasCuotas.push({
        mes,
        capital: capitalPorMes,
        interes: interesMes,
        total: totalMes,
        saldo: saldoPendiente > 0 ? saldoPendiente : 0,
      });
    }

    setCuotas(nuevasCuotas);
  };

  useEffect(() => {
    generarTablaAmortizacion();

    if (resultadoRef.current) {
      gsap.fromTo(
        resultadoRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [monto, plazo, interesAnual]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-5xl w-full p-6 md:p-8 rounded-xl shadow-lg bg-white border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Simulador de Préstamo Personal
            </h1>
            <p className="text-sm text-gray-500">
              Calcula tu préstamo y revisa la tabla de amortización completa
            </p>
          </div>
          <div className="relative group">
            <button
              className="p-1 rounded-full text-gray-500 hover:text-gray-700"
              aria-label="Información"
            >
              <InformationCircleIcon className="h-5 w-5" />
            </button>
            <div className="absolute right-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover:block bg-black text-gray-300 text-sm px-4 py-2 rounded shadow-lg w-64 z-10">
              Este simulador calcula tu préstamo bajo el método de interés
              simple. Ingresa el monto, el plazo y la tasa anual para conocer tu
              cuota mensual.
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Monto */}
          <div>
            <label className="block font-medium mb-2">
              Monto del préstamo (S/)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={monto}
                onChange={(e) => setMonto(parseInt(e.target.value))}
                className="w-full accent-orange-500"
              />
              <input
                type="number"
                min="1000"
                max="100000"
                step="1000"
                value={monto}
                onChange={(e) => setMonto(Number(e.target.value) || 1000)}
                className="w-24 p-2 border border-gray-300 rounded-md text-right"
              />
            </div>
          </div>

          {/* Plazo */}
          <div>
            <label className="block font-medium mb-2">Plazo (meses)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="3"
                max="36"
                step="1"
                value={plazo}
                onChange={(e) => setPlazo(parseInt(e.target.value))}
                className="w-full accent-orange-500"
              />
              <input
                type="number"
                min="3"
                max="36"
                step="1"
                value={plazo}
                onChange={(e) => setPlazo(Number(e.target.value) || 3)}
                className="w-20 p-2 border border-gray-300 rounded-md text-right"
              />
            </div>
          </div>

          {/* Interés */}
          <div>
            <label className="block font-medium mb-2">
              Tasa de interés anual (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="60"
                step="0.5"
                value={interesAnual}
                onChange={(e) => setInteresAnual(parseFloat(e.target.value))}
                className="w-full accent-orange-500"
              />
              <input
                type="number"
                min="5"
                max="60"
                step="0.5"
                value={interesAnual}
                onChange={(e) =>
                  setInteresAnual(parseFloat(e.target.value) || 5)
                }
                className="w-20 p-2 border border-gray-300 rounded-md text-right"
              />
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-sm text-gray-600 mb-1">Monto solicitado</p>
            <p className="text-xl font-bold">{formatear(monto)}</p>
          </div>
          <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
            <p className="text-sm text-gray-600 mb-1">Cuota mensual</p>
            <p className="text-xl font-bold text-orange-600">
              {formatear(cuotaMensual)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-green-50 border border-green-100">
            <p className="text-sm text-gray-600 mb-1">Total a pagar</p>
            <p className="text-xl font-bold text-green-600">
              {formatear(totalPagar)}
            </p>
          </div>
        </div>

        {/* Tabla de amortización */}
        <div ref={resultadoRef} className="mb-4">
          <h3 className="font-semibold mb-4">Tabla de Amortización</h3>
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm max-h-[250px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Mes</th>
                  <th className="p-3 text-right">Capital</th>
                  <th className="p-3 text-right">Interés</th>
                  <th className="p-3 text-right">Total Cuota</th>
                  <th className="p-3 text-right">Saldo Pendiente</th>
                </tr>
              </thead>
              <tbody>
                {cuotas.map((cuota) => (
                  <tr
                    key={cuota.mes}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{cuota.mes}</td>
                    <td className="p-3 text-right">
                      {formatear(cuota.capital)}
                    </td>
                    <td className="p-3 text-right">
                      {formatear(cuota.interes)}
                    </td>
                    <td className="p-3 text-right font-medium">
                      {formatear(cuota.total)}
                    </td>
                    <td className="p-3 text-right">{formatear(cuota.saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
