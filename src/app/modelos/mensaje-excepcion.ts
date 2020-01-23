//Define excepciones y mensajes
export class MensajeExcepcion {

    /*
    * ERRORES GENERALES
    */

    public static ERROR_INTERNO_SERVIDOR = "Error interno en el servidor";

    public static AGREGADO = "Registro agregado con éxito";

    public static NO_AGREGADO = "No se pudo agregar el registro";

    public static ACTUALIZADO = "Registro actualizado con éxito";

    public static NO_ACTUALIZADO = "No se pudo actualizar el registro";

    public static ELIMINADO = "Registro eliminado con éxito";

    public static NO_ELIMINADO = "No se pudo eliminar el registro";

    public static NO_LISTO = "No se pudo obtener la lista de registros";

    public static SIN_REGISTROS = "Sin registros";

    public static VALORIZADO = "Registro valorizado con éxito";

    public static NO_VALORIZADO = "No se pudo valorizar el registro";

    public static SELECCIONAR_PESTANIA = "Falta seleccionar, como mínimo, una pestaña";

    public static REGISTRO_EXISTENTE_LISTA = "Registro existente en lista";

    public static SELECCIONAR_PROVEEDOR = "Seleccione un proveedor";

    public static ANIO_MENOR_ACTUAL = "El año debe ser menor al actual"

    /*
    * FIN ERRORES GENERALES
    */


    /*
    * DATO DUPLICADO 
    */

    //Defiene mensaje de orden venta tarifa y escala
    public static DD_ORDENVENTATARIFA_ESCALA = "Valor de escala existente";

    //Define mensaje de orden venta tarifa y tramo
    public static DD_ORDENVENTATARIFA_TRAMO = "Tramo existente";

    //Define mensaje de tarifa
    public static DD_ORDENVENTATARIFA_TIPOTARIFA = "Tarifa existente en tabla";

    /*
    * FIN DATO DUPLICADO
    */

    /*
    * MENSAJES GENERALES
    */
   public static PREGUNTA_ELIMINAR = '¿Seguro que desea eliminar este registro?';
}