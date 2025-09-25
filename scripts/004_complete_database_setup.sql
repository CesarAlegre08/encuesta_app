-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS public.user_answers CASCADE;
DROP TABLE IF EXISTS public.game_sessions CASCADE;
DROP TABLE IF EXISTS public.questions CASCADE;

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  option_1 TEXT NOT NULL,
  option_2 TEXT NOT NULL,
  option_3 TEXT NOT NULL,
  option_4 TEXT NOT NULL,
  correct_option INTEGER NOT NULL CHECK (correct_option BETWEEN 1 AND 4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game sessions table
CREATE TABLE public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 10,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user answers table to track individual answers
CREATE TABLE public.user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option INTEGER NOT NULL CHECK (selected_option BETWEEN 1 AND 4),
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

-- Create policies for questions table (read-only for all users)
CREATE POLICY "questions_select_all" ON public.questions FOR SELECT USING (true);

-- Create policies for game_sessions table (anyone can insert and read)
CREATE POLICY "game_sessions_insert_all" ON public.game_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "game_sessions_select_all" ON public.game_sessions FOR SELECT USING (true);

-- Create policies for user_answers table (anyone can insert and read)
CREATE POLICY "user_answers_insert_all" ON public.user_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "user_answers_select_all" ON public.user_answers FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_game_sessions_score ON public.game_sessions(score DESC);
CREATE INDEX idx_game_sessions_completed_at ON public.game_sessions(completed_at DESC);
CREATE INDEX idx_user_answers_session_id ON public.user_answers(session_id);

-- Insert all 49 questions from the cuestionario
INSERT INTO public.questions (question_text, option_1, option_2, option_3, option_4, correct_option) VALUES
('¿Cuál es el objetivo principal de la contabilidad?', 'Maximizar las ganancias', 'Proporcionar información financiera útil para la toma de decisiones', 'Minimizar los impuestos', 'Controlar a los empleados', 2),
('¿Qué representa el activo en el balance general?', 'Las deudas de la empresa', 'Los recursos económicos controlados por la entidad', 'Las ganancias del período', 'El capital social', 2),
('¿Cuál es la ecuación contable fundamental?', 'Activo = Pasivo + Patrimonio', 'Ingresos - Gastos = Resultado', 'Activo = Pasivo - Patrimonio', 'Ventas - Costos = Ganancia', 1),
('¿Qué son los pasivos?', 'Los bienes de la empresa', 'Las obligaciones presentes de la entidad', 'Los ingresos futuros', 'El capital aportado por los socios', 2),
('¿Cuál es el principio de devengado?', 'Registrar operaciones solo cuando se cobra o paga', 'Registrar operaciones cuando ocurren, independientemente del cobro o pago', 'Registrar solo operaciones en efectivo', 'Registrar operaciones al final del ejercicio', 2),
('¿Qué es la depreciación?', 'El aumento del valor de un activo', 'La distribución sistemática del costo de un activo a lo largo de su vida útil', 'La venta de un activo', 'El mantenimiento de un activo', 2),
('¿Cuál es la diferencia entre gasto y costo?', 'No hay diferencia', 'El gasto se relaciona con la administración y el costo con la producción', 'El costo es mayor que el gasto', 'El gasto es solo en efectivo', 2),
('¿Qué es el capital de trabajo?', 'El dinero en efectivo', 'La diferencia entre activos corrientes y pasivos corrientes', 'El capital social', 'Los activos fijos', 2),
('¿Cuál es el objetivo del estado de resultados?', 'Mostrar la situación patrimonial', 'Mostrar los ingresos, gastos y resultado del período', 'Mostrar los movimientos de efectivo', 'Mostrar las inversiones', 2),
('¿Qué es la partida doble?', 'Registrar dos veces la misma operación', 'Todo débito debe tener su correspondiente crédito', 'Usar dos libros contables', 'Hacer dos asientos por operación', 2),
('¿Cuál es la vida útil típica de un edificio para efectos contables?', '10 años', '20 años', '50 años', '100 años', 3),
('¿Qué es el goodwill o llave de negocio?', 'Un activo tangible', 'El exceso del precio pagado sobre el valor razonable de activos netos adquiridos', 'Una deuda', 'Un gasto', 2),
('¿Cuál es el método de valuación más común para inventarios?', 'FIFO (Primero en entrar, primero en salir)', 'LIFO (Último en entrar, primero en salir)', 'Promedio ponderado', 'Depende del tipo de empresa', 1),
('¿Qué es la provisión para deudores incobrables?', 'Un activo', 'Una estimación de cuentas por cobrar que no se podrán recuperar', 'Un pasivo', 'Un ingreso', 2),
('¿Cuál es el principio de prudencia o conservadurismo?', 'Ser optimista en las estimaciones', 'Ante la duda, elegir la opción que menos sobrevalore activos e ingresos', 'Registrar todo al costo histórico', 'No hacer estimaciones', 2),
('¿Qué es el flujo de efectivo operativo?', 'El efectivo de inversiones', 'El efectivo generado por las actividades principales del negocio', 'El efectivo de financiamiento', 'El saldo de caja', 2),
('¿Cuál es la diferencia entre reservas y resultados acumulados?', 'No hay diferencia', 'Las reservas son apropiaciones específicas de ganancias', 'Las reservas son deudas', 'Los resultados acumulados son activos', 2),
('¿Qué es el ROE (Return on Equity)?', 'Rentabilidad sobre ventas', 'Rentabilidad sobre el patrimonio', 'Rentabilidad sobre activos', 'Rentabilidad sobre inversiones', 2),
('¿Cuál es el objetivo de la auditoría externa?', 'Encontrar fraudes', 'Expresar una opinión sobre la razonabilidad de los estados financieros', 'Hacer la contabilidad', 'Pagar impuestos', 2),
('¿Qué es el control interno?', 'Solo los controles de efectivo', 'El conjunto de políticas y procedimientos para salvaguardar activos y asegurar información confiable', 'Los controles de inventario', 'La auditoría externa', 2),
('¿Cuál es la diferencia entre contabilidad financiera y gerencial?', 'No hay diferencia', 'La financiera es para usuarios externos y la gerencial para internos', 'La gerencial es más importante', 'La financiera es solo para bancos', 2),
('¿Qué es el punto de equilibrio?', 'Cuando no hay ganancias ni pérdidas', 'El nivel de ventas donde los ingresos igualan a los costos totales', 'Cuando se vende todo el inventario', 'Cuando no hay deudas', 2),
('¿Cuál es la fórmula del margen bruto?', '(Ventas - Costo de ventas) / Ventas', '(Utilidad neta / Ventas)', '(Activos / Pasivos)', '(Ventas / Activos)', 1),
('¿Qué es la rotación de inventarios?', 'Cambiar de proveedor', 'Costo de ventas / Inventario promedio', 'Vender todo el inventario', 'Contar el inventario', 2),
('¿Cuál es el objetivo del presupuesto?', 'Gastar menos', 'Planificar y controlar las operaciones futuras', 'Pagar impuestos', 'Hacer la contabilidad', 2),
('¿Qué es el costo estándar?', 'El costo real', 'Un costo predeterminado que sirve como base de comparación', 'El costo más alto', 'El costo promedio', 2),
('¿Cuál es la diferencia entre costos fijos y variables?', 'Los fijos son más importantes', 'Los fijos no cambian con el volumen, los variables sí', 'Los variables son más caros', 'No hay diferencia', 2),
('¿Qué es el análisis vertical en estados financieros?', 'Comparar con años anteriores', 'Expresar cada partida como porcentaje de una base', 'Analizar solo los activos', 'Revisar solo los pasivos', 2),
('¿Cuál es el objetivo del estado de cambios en el patrimonio?', 'Mostrar las ventas', 'Explicar las variaciones en las cuentas patrimoniales', 'Mostrar los gastos', 'Mostrar el efectivo', 2),
('¿Qué es la consolidación de estados financieros?', 'Sumar todos los números', 'Combinar los estados financieros de una matriz y sus subsidiarias', 'Hacer un resumen', 'Cambiar el formato', 2),
('¿Cuál es el principio de materialidad?', 'Todo es importante', 'Solo se registran y revelan partidas que pueden influir en las decisiones', 'Solo importan los activos grandes', 'Todo debe ser exacto', 2),
('¿Qué es el valor presente neto (VPN)?', 'El valor actual', 'El valor actual de flujos futuros descontados a una tasa', 'El valor de mercado', 'El valor en libros', 2),
('¿Cuál es la tasa interna de retorno (TIR)?', 'La tasa de interés del banco', 'La tasa que hace que el VPN sea igual a cero', 'La tasa de inflación', 'La tasa impositiva', 2),
('¿Qué es el apalancamiento financiero?', 'Usar solo capital propio', 'Usar deuda para financiar activos y amplificar la rentabilidad', 'No tener deudas', 'Vender activos', 2),
('¿Cuál es el objetivo del análisis de ratios financieros?', 'Hacer cálculos complejos', 'Evaluar la performance y situación financiera de la empresa', 'Cumplir con regulaciones', 'Preparar impuestos', 2),
('¿Qué es la liquidez?', 'Tener mucho efectivo', 'La capacidad de convertir activos en efectivo rápidamente', 'Vender inventarios', 'Pagar deudas', 2),
('¿Cuál es la diferencia entre rentabilidad y liquidez?', 'Son lo mismo', 'Rentabilidad mide ganancias, liquidez mide capacidad de pago inmediato', 'La liquidez es más importante', 'La rentabilidad es solo para accionistas', 2),
('¿Qué es el ciclo operativo?', 'Un año', 'El tiempo desde la compra de inventario hasta el cobro de la venta', 'El tiempo de producción', 'El ejercicio contable', 2),
('¿Cuál es el objetivo de la planificación fiscal?', 'Evadir impuestos', 'Optimizar legalmente la carga tributaria', 'No pagar impuestos', 'Pagar más impuestos', 2),
('¿Qué es el costo de oportunidad?', 'El costo más bajo', 'El beneficio al que se renuncia al elegir una alternativa', 'El costo promedio', 'El costo fijo', 2),
('¿Cuál es la importancia del control de gestión?', 'Solo controlar gastos', 'Asegurar que se cumplan los objetivos organizacionales', 'Reducir personal', 'Aumentar ventas', 2),
('¿Qué es la contabilidad por áreas de responsabilidad?', 'Culpar a alguien por errores', 'Asignar costos e ingresos a centros de responsabilidad específicos', 'Dividir la empresa', 'Cambiar la estructura', 2),
('¿Cuál es el objetivo de la contabilidad de costos?', 'Reducir costos', 'Determinar el costo de productos, servicios y actividades', 'Eliminar gastos', 'Controlar empleados', 2),
('¿Qué es el balanced scorecard?', 'Un estado financiero', 'Una herramienta de gestión que integra indicadores financieros y no financieros', 'Un presupuesto', 'Un sistema contable', 2),
('¿Cuál es la importancia de la ética en contabilidad?', 'No es importante', 'Fundamental para la credibilidad y confianza en la información financiera', 'Solo para auditores', 'Solo para gerentes', 2),
('¿Qué es la responsabilidad social empresarial en el contexto contable?', 'Una moda', 'La obligación de reportar el impacto social y ambiental de las operaciones', 'Solo marketing', 'Solo para grandes empresas', 2),
('¿Cuál es el futuro de la profesión contable?', 'Desaparecerá', 'Evolucionará hacia análisis estratégico y asesoramiento', 'Se mantendrá igual', 'Solo será automatizada', 2),
('¿Qué es la contabilidad forense?', 'Contabilidad de hospitales', 'La aplicación de técnicas contables en investigaciones legales', 'Contabilidad de seguros', 'Contabilidad gubernamental', 2),
('¿Cuál es la importancia de la educación continua en contabilidad?', 'No es necesaria', 'Esencial debido a los cambios constantes en normas y tecnología', 'Solo para socios', 'Solo para auditores', 2);
