---
layout: post
title: GridView maestro-detalle en ASP .NET
tags: [ASP .NET]
---

Hace unos días trabajando en un proyecto de ASP .NET, tuve que implementar el clásico grid maestro-detalle, en el que cada registro de la tabla posee un botón que al pulsarlo muestra su detalle en la parte inferior. Para ello, bastará con definir el detalle como si fuera una nueva columna del grid, con la diferencia de que al desplegarlo tendrá apariencia de fila debido a las propiedades de estilo que le daremos.

El código HTML:

{% highlight html linenos %}
<asp:GridView ID="gvPruebas" runat="server" AutoGenerateColumns="False"
           AllowSorting="True" Width="100%" EmptyDataText="No se encontraron resultados"
           DataKeyNames="IdObjeto" EnableModelValidation="True">
           <PagerStyle HorizontalAlign="Right" />
           <Columns>
               <asp:BoundField DataField="IdObjeto" HeaderText="Id" SortExpression="0" />
               <asp:TemplateField HeaderText="Detalle">
                   <ItemTemplate>
                       <asp:Button ID="btnDetalle" runat="server" CommandArgument='<%# CType(Container,GridViewRow).RowIndex %>'
                           CommandName="Detalle" Text="Detalle"></asp:Button>
                   </ItemTemplate>
               </asp:TemplateField>
               <asp:TemplateField>
                   <ItemTemplate>
                       <asp:Panel runat="server" ID="rowPanel" Visible="false">
                           <tr style="display: inline;">
                               <td colspan="100%" align="center">
                                   <asp:Panel runat="server" ID="controlPanel">
                                   </asp:Panel>
                               </td>
                           </tr>
                       </asp:Panel>
                   </ItemTemplate>
               </asp:TemplateField>
           </Columns>
       </asp:GridView>
{% endhighlight %}

En cuanto al code-behind, implementaremos el evento **RowCommand** del grid y cada vez que se pulse un botón de detalle, crearemos dinámicamente el control que queremos que muestre el detalle y lo anexaremos a la columna correcta:

{% highlight visualbasic linenos %}
Private Sub gvPruebas_RowCommand(sender As Object, e As System.Web.UI.WebControls.GridViewCommandEventArgs) Handles gvPruebas.RowCommand
        Try
  
            Select Case e.CommandName
                Case "Detalle"
  
                    'Obtenemos la fila seleccionada.
                    Dim index As Integer = Convert.ToInt32(e.CommandArgument.ToString())
                    Dim row As GridViewRow = gvPruebas.Rows(index)
  
                    'Leemos la celda que debe contener el detalle de la fila.
                    Dim cell As TableCell = row.Cells(2)
                    Dim div As Control = cell.FindControl("rowPanel")
                    If (div IsNot Nothing) Then
                        Dim panel As Panel = DirectCast(div, Panel)
                        If (panel IsNot Nothing) Then
                            If panel.Visible Then
                                Dim cell As TableCell = row.Cells(2)
                                Dim div As Control = cell.FindControl("controlPanel")
                                If (div IsNot Nothing) Then
                                    Dim panel As Panel = DirectCast(div, Panel)
                                    If panel IsNot Nothing Then
                                        'Añadimos control.
                                        Dim lblPrueba As Label = New Label()
                                        lblPrueba .ID = "lblPrueba"
                                        lblPrueba .Text = "PRUEBA"
  
                                        panel.Controls.Add(gridCuotas) 
                                    End If
                                End If
                            End If
                        End If
                    End If
            End Select
  
        Catch ex As Exception
            Throw
        End Try
    End Sub
{% endhighlight %}

En mi opinión, la parte más complicada viene cuando en cada postback de la página queremos mantener desplegados los detalles de las filas que vamos seleccionando. Las implementaciones que encontré para esto buscando en “Google” utilizaban el evento **RowCreated** del grid. Sin embargo, este evento salta en cada postback incluso antes del evento “Page_Load”, por lo que tendremos muchas limitaciones a la hora de leer valores de la página o de los controles (ya que en ese momento no están inicializados).

Por tanto, la implementación que he realizado yo (seguramente habrá muchas más posibilidades) es la siguiente:
- Cada vez que se cargan datos nuevamente en el grid se guarda en el ViewState una lista con los IDs de cada registro y el índice de fila donde se encuentra.
- Asumimos que en cada ordenación del grid se refrescan los datos.
- En el evento RowCommand anterior gestionamos otra lista que también se almacena en el **ViewState**, que contiene los IDs de los registros cuyos detalles están seleccionados. Si el panel estaba visible, lo ocultamos y removemos su ID de dicha lista, en caso contrario lo añadimos y lo hacemos visible.
- En el evento Page_Load capturamos cada postback de la página y recorremos la lista de detalles seleccionados, usando la otra lista para localizar el índice de la fila a partir del ID del registro.

Por último, hay que tener en cuenta que si se sigue este mecanismo habrá que diferenciar en el Page_Load cuando el postback se ha producido por un botón de “detalle” y en qué registro se encuentra éste. ¿Por qué? Pues porque si pulsamos el botón de un detalle que ya está desplegado, el Page_Load se ejecutará antes que el evento RowCommand y por tanto ese detalle seguirá en la lista de seleccionados, sin embargo no queremos mostrarlo, sino ocultarlo.

Para ello, yo he generado cada botón de detalle dinámicamente en el evento RowCreated, en vez de definirlo en el marcado HTML como plantilla de columna. De esta forma, he generado el ID de cada botón dinámicamente con la forma “btnDetalle” + id_objeto.

¡Y nada más por ahora! Si tenéis cualquier problema con la implementación o necesitáis ejemplos del código fuente, ¡no dudéis en pedírmelo!