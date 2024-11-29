export function sanitizarInput(input: string): string {
  return input.replace(/['"%;()\\]/g, '');
}

export function validarRUT(rut: string): boolean {
    const rutLimpio = sanitizarInput(rut).replace(/[^\dkK]/g, ''); // Eliminar puntos y guiones

    if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;
  
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    let suma = 0;
    let multiplicador = 2;
  
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += Number(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
  
    const resto = suma % 11;
    const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'K' : (11 - resto).toString();
  
    return dv === dvCalculado;
}

  