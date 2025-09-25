-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.user_answers CASCADE;
DROP TABLE IF EXISTS public.game_sessions CASCADE;
DROP TABLE IF EXISTS public.questions CASCADE;

-- Create questions table
CREATE TABLE public.questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    option_1 TEXT NOT NULL,
    option_2 TEXT NOT NULL,
    option_3 TEXT NOT NULL,
    option_4 TEXT NOT NULL,
    correct_option INTEGER NOT NULL CHECK (correct_option BETWEEN 1 AND 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_sessions table
CREATE TABLE public.game_sessions (
    id SERIAL PRIMARY KEY,
    player_name TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 10,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_answers table
CREATE TABLE public.user_answers (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_option INTEGER NOT NULL CHECK (selected_option BETWEEN 1 AND 4),
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public quiz)
CREATE POLICY "Allow public read access on questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on game_sessions" ON public.game_sessions FOR ALL USING (true);
CREATE POLICY "Allow public insert/update on user_answers" ON public.user_answers FOR ALL USING (true);

-- Insert all 49 questions from the cuestionario
INSERT INTO public.questions (question_text, option_1, option_2, option_3, option_4, correct_option) VALUES
('¿Cuál es el objetivo principal de la contabilidad?', 'Maximizar las ganancias', 'Proporcionar información financiera útil para la toma de decisiones', 'Minimizar los impuestos', 'Controlar a los empleados', 2),
('¿Qué es un activo en contabilidad?', 'Una deuda de la empresa', 'Un recurso controlado por la empresa que se espera genere beneficios económicos futuros', 'Un gasto del período', 'Una pérdida contable', 2),
('¿Cuál es la ecuación contable fundamental?', 'Activos = Pasivos + Patrimonio', 'Ingresos = Gastos + Utilidad', 'Activos = Ingresos - Gastos', 'Pasivos = Activos - Ingresos', 1),
('¿Qué representa el pasivo en el balance general?', 'Los recursos de la empresa', 'Las obligaciones o deudas de la empresa', 'Las ganancias acumuladas', 'Los ingresos del período', 2),
('¿Cuál es el principio de partida doble?', 'Cada transacción afecta al menos dos cuentas', 'Solo se registran las transacciones en efectivo', 'Se registra solo el debe o el haber', 'Las transacciones se registran una sola vez', 1),
('¿Qué es el patrimonio neto?', 'La diferencia entre activos y pasivos', 'El total de deudas de la empresa', 'Los ingresos menos los gastos', 'El efectivo disponible', 1),
('¿Cuál es la función principal del balance general?', 'Mostrar los ingresos y gastos del período', 'Presentar la situación financiera de la empresa en un momento determinado', 'Calcular los impuestos a pagar', 'Determinar el flujo de efectivo', 2),
('¿Qué es la depreciación?', 'El aumento del valor de un activo', 'La distribución sistemática del costo de un activo a lo largo de su vida útil', 'Una pérdida extraordinaria', 'Un ingreso diferido', 2),
('¿Cuál es el período contable más común?', '6 meses', '12 meses', '18 meses', '24 meses', 2),
('¿Qué son las cuentas por cobrar?', 'Dinero que la empresa debe pagar', 'Dinero que los clientes deben a la empresa', 'Gastos pendientes de pago', 'Ingresos futuros', 2),
('¿Cuál es la diferencia entre gasto y costo?', 'No hay diferencia', 'El gasto se relaciona con la operación, el costo con la producción', 'El costo es mayor que el gasto', 'El gasto es solo en efectivo', 2),
('¿Qué es el estado de resultados?', 'Un informe que muestra activos y pasivos', 'Un informe que muestra ingresos, gastos y utilidad de un período', 'Un informe de flujo de efectivo', 'Un informe de cambios en el patrimonio', 2),
('¿Cuál es el principio de devengado?', 'Solo registrar transacciones en efectivo', 'Registrar transacciones cuando ocurren, independientemente del pago', 'Registrar solo al final del período', 'Registrar solo las ventas', 2),
('¿Qué es la liquidez?', 'La capacidad de generar ganancias', 'La facilidad para convertir activos en efectivo', 'El total de deudas', 'La rentabilidad de la empresa', 2),
('¿Cuál es el objetivo de la auditoría?', 'Encontrar errores', 'Expresar una opinión sobre la razonabilidad de los estados financieros', 'Calcular impuestos', 'Preparar presupuestos', 2),
('¿Qué es el capital de trabajo?', 'El total de activos', 'La diferencia entre activos corrientes y pasivos corrientes', 'El patrimonio de los socios', 'Los ingresos del período', 2),
('¿Cuál es la característica principal de los activos corrientes?', 'Son intangibles', 'Se espera convertir en efectivo dentro de un año', 'No se deprecian', 'Son de largo plazo', 2),
('¿Qué es una provisión?', 'Un activo futuro', 'Un pasivo estimado', 'Un ingreso diferido', 'Una cuenta de patrimonio', 2),
('¿Cuál es el propósito del estado de flujo de efectivo?', 'Mostrar la rentabilidad', 'Mostrar los movimientos de efectivo durante un período', 'Calcular la depreciación', 'Determinar el patrimonio', 2),
('¿Qué es el goodwill o llave de negocio?', 'Un activo tangible', 'Un activo intangible que representa el valor adicional de una empresa', 'Una deuda', 'Un gasto operativo', 2),
('¿Cuál es la base del sistema de costeo por absorción?', 'Solo costos variables', 'Todos los costos de producción (fijos y variables)', 'Solo costos fijos', 'Solo materiales directos', 2),
('¿Qué es el punto de equilibrio?', 'El nivel de ventas donde los ingresos igualan a los costos totales', 'El máximo nivel de producción', 'El mínimo nivel de ventas', 'El nivel óptimo de inventario', 1),
('¿Cuál es la diferencia entre costos fijos y variables?', 'Los fijos cambian con el volumen, los variables no', 'Los fijos no cambian con el volumen, los variables sí', 'No hay diferencia', 'Los variables son siempre mayores', 2),
('¿Qué es el margen de contribución?', 'Ventas menos costos fijos', 'Ventas menos costos variables', 'Ventas menos todos los costos', 'Solo las ventas', 2),
('¿Cuál es el objetivo del presupuesto?', 'Limitar gastos', 'Planificar y controlar las operaciones futuras', 'Calcular impuestos', 'Determinar precios', 2),
('¿Qué es la rotación de inventarios?', 'El tiempo que tarda en venderse el inventario', 'La frecuencia con que se renueva el inventario en un período', 'El costo del inventario', 'El valor del inventario', 2),
('¿Cuál es la fórmula del ROE (Return on Equity)?', 'Utilidad Neta / Patrimonio', 'Ventas / Activos', 'Activos / Pasivos', 'Ingresos / Gastos', 1),
('¿Qué es el apalancamiento financiero?', 'Usar deuda para financiar activos', 'Usar solo capital propio', 'Vender activos', 'Reducir costos', 1),
('¿Cuál es el propósito de los ratios financieros?', 'Calcular impuestos', 'Analizar y comparar el desempeño financiero', 'Determinar precios', 'Controlar inventarios', 2),
('¿Qué es el EBITDA?', 'Earnings Before Interest, Taxes, Depreciation and Amortization', 'Earnings Before Income Tax', 'Earnings Before Interest', 'Earnings Before Tax Deduction', 1),
('¿Cuál es la diferencia entre rentabilidad y liquidez?', 'Son lo mismo', 'Rentabilidad mide ganancias, liquidez mide capacidad de pago', 'Liquidez es mayor que rentabilidad', 'Rentabilidad es solo para bancos', 2),
('¿Qué es el ciclo operativo?', 'El tiempo desde la compra hasta la cobranza', 'El período contable', 'El tiempo de producción', 'El tiempo de venta', 1),
('¿Cuál es el objetivo del control interno?', 'Aumentar ventas', 'Salvaguardar activos y asegurar información confiable', 'Reducir personal', 'Maximizar utilidades', 2),
('¿Qué es la materialidad en auditoría?', 'El tipo de material usado', 'La importancia relativa de una partida o error', 'El costo de la auditoría', 'El tiempo de la auditoría', 2),
('¿Cuál es la diferencia entre riesgo inherente y riesgo de control?', 'No hay diferencia', 'Inherente es natural del negocio, control es por fallas en controles', 'Control es mayor que inherente', 'Inherente solo aplica a inventarios', 2),
('¿Qué es el valor presente neto (VPN)?', 'El valor actual de flujos futuros descontados', 'El valor futuro de una inversión', 'El costo de capital', 'La tasa de interés', 1),
('¿Cuál es el propósito de la tasa interna de retorno (TIR)?', 'Calcular impuestos', 'Evaluar la rentabilidad de una inversión', 'Determinar el precio de venta', 'Calcular la depreciación', 2),
('¿Qué es el costo de capital?', 'El costo de los activos', 'La tasa de retorno requerida por los inversionistas', 'El costo de producción', 'El costo de ventas', 2),
('¿Cuál es la diferencia entre valor contable y valor de mercado?', 'Son iguales', 'Contable es según registros, mercado es según oferta y demanda', 'Mercado es siempre menor', 'Contable incluye inflación', 2),
('¿Qué es la inflación contable?', 'El aumento de precios que afecta los estados financieros', 'Un error en los registros', 'Un tipo de depreciación', 'Una cuenta del balance', 1),
('¿Cuál es el objetivo de la contabilidad de costos?', 'Calcular impuestos', 'Determinar el costo de productos o servicios', 'Preparar balances', 'Controlar efectivo', 2),
('¿Qué es el costeo ABC (Activity Based Costing)?', 'Un método que asigna costos basado en actividades', 'Un método de depreciación', 'Un tipo de inventario', 'Un sistema de ventas', 1),
('¿Cuál es la diferencia entre costo estándar y costo real?', 'No hay diferencia', 'Estándar es predeterminado, real es el que efectivamente ocurrió', 'Real es siempre mayor', 'Estándar solo aplica a materiales', 2),
('¿Qué es la variación en costos estándar?', 'La diferencia entre costo estándar y real', 'El aumento de costos', 'Un tipo de inventario', 'Una cuenta de activo', 1),
('¿Cuál es el propósito del análisis de variaciones?', 'Aumentar precios', 'Identificar desviaciones y sus causas para tomar acciones correctivas', 'Reducir personal', 'Cambiar proveedores', 2),
('¿Qué es el margen bruto?', 'Ventas menos costo de ventas', 'Ventas menos gastos operativos', 'Ventas menos impuestos', 'Solo las ventas', 1),
('¿Cuál es la importancia del análisis horizontal?', 'Comparar con otras empresas', 'Analizar tendencias en el tiempo', 'Calcular ratios', 'Determinar precios', 2),
('¿Qué es el análisis vertical?', 'Analizar cada partida como porcentaje de una base', 'Analizar tendencias', 'Comparar con competidores', 'Calcular variaciones', 1),
('¿Cuál es el objetivo final de la información contable?', 'Cumplir con regulaciones', 'Facilitar la toma de decisiones económicas', 'Calcular impuestos', 'Controlar empleados', 2);
