"use client";

import {
  ArrowPathIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

type Cuota = {
  mes: number;
  capital: number;
  interes: number;
  total: number;
  saldo: number;
};

type SistemaAmortizacion = "frances" | "aleman" | "americano";

const formatear = (valor: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(valor);

const NumeroAnimado = ({ value }: { value: number }) => (
  <motion.span
    key={value}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {formatear(value)}
  </motion.span>
);

const SistemaButton = ({
  sistema,
  currentSistema,
  setSistema,
  nombre,
  descripcion,
}: {
  sistema: SistemaAmortizacion;
  currentSistema: SistemaAmortizacion;
  setSistema: (s: SistemaAmortizacion) => void;
  nombre: string;
  descripcion: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => setSistema(sistema)}
    className={`p-4 rounded-xl border-2 transition-all ${
      currentSistema === sistema
        ? "bg-orange-50 border-orange-400 shadow-md"
        : "bg-white border-gray-200 hover:border-gray-300"
    }`}
  >
    <h3 className="font-semibold mb-1">{nombre}</h3>
    <p className="text-sm text-gray-600">{descripcion}</p>
  </motion.button>
);

const ResumenCard = ({
  titulo,
  valor,
  isCalculating,
  color,
}: {
  titulo: string;
  valor: number;
  isCalculating: boolean;
  color: string;
}) => (
  <motion.div
    whileHover={{ y: -3 }}
    className={`p-5 rounded-xl bg-gradient-to-br from-${color}-50 to-${color}-100 border border-${color}-200 shadow-sm`}
  >
    <p className={`text-sm text-${color}-700 mb-2`}>{titulo}</p>
    <p className={`text-2xl font-bold text-${color}-700`}>
      {isCalculating ? (
        <ArrowPathIcon className="h-6 w-6 animate-spin" />
      ) : (
        <NumeroAnimado value={valor} />
      )}
    </p>
  </motion.div>
);

export default function SimuladorPrestamo() {
  const [monto, setMonto] = useState(10000);
  const [plazo, setPlazo] = useState(12);
  const [interesAnual, setInteresAnual] = useState(24);
  const [sistema, setSistema] = useState<SistemaAmortizacion>("frances");
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const resultadoRef = useRef<HTMLDivElement>(null);

  const interesMensual = interesAnual / 12 / 100;
  const totalInteres = cuotas.reduce((sum, cuota) => sum + cuota.interes, 0);
  const totalPagar = monto + totalInteres;
  const primeraCuota = cuotas.length > 0 ? cuotas[0].total : 0;

  const calcularCuota = () => {
    if (sistema === "frances") {
      return (
        (monto * interesMensual) / (1 - Math.pow(1 + interesMensual, -plazo))
      );
    } else if (sistema === "americano") {
      return monto * interesMensual;
    } else {
      const totalInteres = monto * interesMensual * plazo;
      const totalPagar = monto + totalInteres;
      return totalPagar / plazo;
    }
  };

  const generarTablaAmortizacion = () => {
    setIsCalculating(true);
    const nuevasCuotas: Cuota[] = [];
    let saldoPendiente = monto;
    const cuotaMensual = calcularCuota();

    for (let mes = 1; mes <= plazo; mes++) {
      let interesMes, capitalMes;

      if (sistema === "frances") {
        interesMes = saldoPendiente * interesMensual;
        capitalMes = cuotaMensual - interesMes;
      } else if (sistema === "americano") {
        interesMes = saldoPendiente * interesMensual;
        capitalMes = mes === plazo ? monto : 0;
      } else {
        capitalMes = monto / plazo;
        interesMes = saldoPendiente * interesMensual;
      }

      const totalMes = capitalMes + interesMes;
      saldoPendiente -= capitalMes;

      nuevasCuotas.push({
        mes,
        capital: capitalMes,
        interes: interesMes,
        total: sistema === "frances" ? cuotaMensual : totalMes,
        saldo: saldoPendiente > 0 ? saldoPendiente : 0,
      });
    }

    setTimeout(() => {
      setCuotas(nuevasCuotas);
      setIsCalculating(false);
    }, 500);
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
  }, [monto, plazo, interesAnual, sistema]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 font-sans pb-5 pt-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl w-full p-6 md:p-8 rounded-2xl shadow-xl bg-white border border-gray-200"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Simulador de Préstamo
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Compara diferentes sistemas de amortización
            </p>
          </div>
          <div className="relative group">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
              <InformationCircleIcon className="h-6 w-6" />
            </button>
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-gray-800 text-gray-100 text-sm px-4 py-3 rounded-lg shadow-xl w-72 z-10 animate-fadeIn transition-all">
              <p className="font-medium mb-1">Sistemas de amortización:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <span className="font-medium">Francés:</span> Cuotas fijas
                </li>
                <li>
                  <span className="font-medium">Alemán:</span> Cuotas
                  decrecientes
                </li>
                <li>
                  <span className="font-medium">Americano:</span> Pago final de
                  capital
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Monto del préstamo (S/)",
              value: monto,
              min: 1000,
              max: 100000,
              step: 1000,
              onChange: setMonto,
              prefix: "S/",
            },
            {
              label: "Plazo (meses)",
              value: plazo,
              min: 3,
              max: 36,
              step: 1,
              onChange: setPlazo,
            },
            {
              label: "Tasa de interés anual (%)",
              value: interesAnual,
              min: 5,
              max: 60,
              step: 0.5,
              onChange: setInteresAnual,
              suffix: "%",
            },
          ].map((control, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              className="bg-gray-50 p-4 rounded-xl border border-gray-200"
            >
              <label className="block font-medium mb-3 text-gray-700">
                {control.label}
              </label>
              <div className="flex flex-col gap-3">
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={control.value}
                  onChange={(e) => control.onChange(Number(e.target.value))}
                  className="w-full accent-orange-500 h-2 rounded-full cursor-pointer"
                />
                <div className="relative">
                  <input
                    type="number"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={control.value}
                    onChange={(e) =>
                      control.onChange(Number(e.target.value) || control.min)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg text-right font-medium text-lg bg-white shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {control.prefix && (
                    <span className="absolute left-3 top-3.5 text-gray-500">
                      {control.prefix}
                    </span>
                  )}
                  {control.suffix && (
                    <span className="absolute right-3 top-3.5 text-gray-500">
                      {control.suffix}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selector de sistema */}
        <motion.div className="mb-8">
          <label className="block font-medium mb-3 text-gray-700">
            Sistema de amortización
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SistemaButton
              sistema="frances"
              currentSistema={sistema}
              setSistema={setSistema}
              nombre="Francés"
              descripcion="Cuota fija"
            />
            <SistemaButton
              sistema="aleman"
              currentSistema={sistema}
              setSistema={setSistema}
              nombre="Alemán"
              descripcion="Cuota decreciente"
            />
            <SistemaButton
              sistema="americano"
              currentSistema={sistema}
              setSistema={setSistema}
              nombre="Americano"
              descripcion="Pago final"
            />
          </div>
        </motion.div>

        {/* Resumen */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <ResumenCard
            titulo="Monto solicitado"
            valor={monto}
            isCalculating={isCalculating}
            color="blue"
          />
          <ResumenCard
            titulo={
              sistema === "frances"
                ? "Cuota mensual"
                : sistema === "americano"
                ? "Cuota periódica"
                : "Primera cuota"
            }
            valor={primeraCuota}
            isCalculating={isCalculating}
            color="orange"
          />
          <ResumenCard
            titulo="Total a pagar"
            valor={totalPagar}
            isCalculating={isCalculating}
            color="green"
          />
        </motion.div>

        {/* Tabla de amortización */}
        <motion.div
          ref={resultadoRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Tabla de Amortización
            </h3>
            <div className="text-sm text-gray-500">
              {sistema === "frances" && "Cuotas fijas con interés decreciente"}
              {sistema === "aleman" && "Cuotas decrecientes con capital fijo"}
              {sistema === "americano" &&
                "Pago de intereses + capital al final"}
            </div>
          </div>

          <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr className="text-left">
                    <th className="p-3 font-medium text-gray-700">Mes</th>
                    <th className="p-3 font-medium text-gray-700 text-right">
                      Capital
                    </th>
                    <th className="p-3 font-medium text-gray-700 text-right">
                      Interés
                    </th>
                    <th className="p-3 font-medium text-gray-700 text-right">
                      Cuota
                    </th>
                    <th className="p-3 font-medium text-gray-700 text-right">
                      Saldo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {isCalculating ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center">
                          <div className="flex justify-center items-center gap-2 text-gray-500">
                            <ArrowPathIcon className="h-5 w-5 animate-spin" />
                            Calculando...
                          </div>
                        </td>
                      </tr>
                    ) : (
                      cuotas.map((cuota) => (
                        <motion.tr
                          key={cuota.mes}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="p-3">{cuota.mes}</td>
                          <td className="p-3 text-right">
                            {formatear(cuota.capital)}
                          </td>
                          <td className="p-3 text-right">
                            {formatear(cuota.interes)}
                          </td>
                          <td className="p-3 text-right font-medium text-orange-600">
                            {formatear(cuota.total)}
                          </td>
                          <td className="p-3 text-right">
                            {formatear(cuota.saldo)}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Gráfico de composición */}
        <motion.div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-medium mb-4 text-gray-700">
            Distribución de pagos
          </h3>
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
              style={{
                width: `${(monto / totalPagar) * 100}%`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <div className="flex justify-between mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
              <span>Capital: {formatear(monto)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-300"></span>
              <span>Intereses: {formatear(totalInteres)}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
