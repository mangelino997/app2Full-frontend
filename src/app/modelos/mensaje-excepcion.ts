//Define excepciones y mensajes
export class MensajeExcepcion {

    /*
    * ERRORES GENERALES
    */

    public static ERROR_INTERNO_SERVIDOR = "Error interno en el servidor";

    public static AGREGADO = "Registro agregado con éxito";

    public static ACTUALIZADO = "Registro actualizado con éxito";

    public static ELIMINADO = "Registro eliminado con éxito";

    public static NO_ELIMINADO = "No se pudo eliminar el registro";

    public static NO_LISTO = "No se obtener la lista de registros";

    public static SIN_REGISTROS = "Sin registros";


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
}