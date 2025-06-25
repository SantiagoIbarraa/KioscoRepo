import jsPDF from 'jspdf'
import { Order } from '../types'

export const generateOrderPDF = (order: Order, userName: string) => {
  const doc = new jsPDF();
  
  // Configurar colores para el diseño del comprobante
  const primaryColor = [139, 69, 19] // Marron para el encabezado
  const borderColor = [139, 69, 19] // Bordes marrones
  const lightBrown = [245, 240, 230] // Fondo crema claro para encabezados de tabla
  const textColor = [51, 51, 51] // Texto gris oscuro
  const headerTextColor = [255, 255, 255] // Texto blanco para el encabezado
  
  // Seccion de encabezado con fondo marron
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 45, 'F');
  
  // Texto del encabezado - posicionado correctamente
  doc.setTextColor(...headerTextColor);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('KIOSCO ESCOLAR', 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Pedidos Online', 20, 35);
  
  // Main title
  doc.setTextColor(...textColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPROBANTE DE PEDIDO', 20, 60);
  
  // Caja de detalles del pedido con borde
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(2);
  doc.rect(20, 70, 170, 56); // Reduced height for tighter fit
  
  // Contenido de detalles del pedido - con espaciado adecuado
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  
  // Left column
  doc.text('Número de Pedido:', 25, 82);
  doc.setFont('helvetica', 'normal');
  doc.text(order.id, 25, 89);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Cliente:', 25, 98);
  doc.setFont('helvetica', 'normal');
  doc.text(userName, 25, 105);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha:', 25, 114);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(order.createdAt).toLocaleDateString('es-AR'), 25, 121);
  
  // Right column
  doc.setFont('helvetica', 'bold');
  doc.text('Horario de Retiro:', 110, 82);
  doc.setFont('helvetica', 'normal');
  doc.text(order.scheduledTime, 110, 89);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Estado:', 110, 98);
  doc.setFont('helvetica', 'normal');
  const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ');
  doc.text(statusText, 110, 105);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Método de Pago:', 110, 114);
  doc.setFont('helvetica', 'normal');
  const paymentText = order.paymentMethod === 'tarjeta' ? 'Tarjeta de Crédito' : 
                     order.paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Efectivo';
  doc.text(paymentText, 110, 121);
  
  // Titulo de la seccion de productos
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PRODUCTOS PEDIDOS', 20, 140);
  
  // Encabezado de tabla con fondo
  doc.setFillColor(...lightBrown);
  doc.rect(20, 150, 170, 10, 'F');
  
  // Bordes del encabezado de tabla
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(1);
  doc.rect(20, 150, 170, 10);
  
  // Texto del encabezado de tabla
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Producto', 25, 157);
  doc.text('Cant.', 120, 157);
  doc.text('Precio Unit.', 140, 157);
  doc.text('Subtotal', 170, 157);
  
  // Contenido de la tabla
  let yPosition = 165.8; // Start right below the header
  doc.setFont('helvetica', 'normal');
  
  order.items.forEach((item, index) => {
    // Calcular altura de fila segun el contenido
    let rowHeight = 12; // Reduced base row height
    let hasCustomizations = item.customizations && 
      ((item.customizations.ingredients && item.customizations.ingredients.length > 0) ||
       (item.customizations.condiments && item.customizations.condiments.length > 0));
    
    if (hasCustomizations) {
      rowHeight += 4; // Minimal extra space for customizations
    }
    
    // Fondo alternado para filas
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(20, yPosition - 5, 170, rowHeight, 'F');
    }
    
    // Borde de fila - sin borde inferior para mejor apariencia
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(20, yPosition - 5, 170, rowHeight);
    doc.setDrawColor(255, 255, 255); // Hide bottom border
    doc.line(20, yPosition - 5 + rowHeight, 190, yPosition - 5 + rowHeight);
    
    // Nombre del producto (recortar si es muy largo)
    let productName = item.product.name;
    if (productName.length > 25) {
      productName = productName.substring(0, 22) + '...';
    }
    
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text(productName, 25, yPosition);
    doc.text(item.quantity.toString(), 125, yPosition);
    doc.text(`$${item.product.price.toLocaleString()}`, 145, yPosition);
    doc.text(`$${(item.product.price * item.quantity).toLocaleString()}`, 175, yPosition);
    
    // Agregar personalizaciones si las hay
    if (hasCustomizations) {
      yPosition += 8;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      
      if (item.customizations.ingredients && item.customizations.ingredients.length > 0) {
        let ingredientsText = `Ingredientes: ${item.customizations.ingredients.join(', ')}`;
        if (ingredientsText.length > 60) {
          ingredientsText = ingredientsText.substring(0, 57) + '...';
        }
        doc.text(ingredientsText, 30, yPosition);
      }
      
      if (item.customizations.condiments && item.customizations.condiments.length > 0) {
        yPosition += 4;
        let condimentsText = `Condimentos: ${item.customizations.condiments.join(', ')}`;
        if (condimentsText.length > 60) {
          condimentsText = condimentsText.substring(0, 57) + '...';
        }
        doc.text(condimentsText, 30, yPosition);
      }
      
      doc.setTextColor(...textColor);
    }
    
    yPosition += rowHeight;
  });
  
  // Seccion de total con espaciado adecuado
  yPosition += 5; // Reduced spacing before total line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(2);
  doc.line(20, yPosition, 190, yPosition);
  
  yPosition += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...textColor);
  doc.text('TOTAL:', 140, yPosition);
  doc.setFontSize(18);
  doc.text(`$${order.totalAmount.toLocaleString()}`, 170, yPosition);
  
  // Seccion de pie de pagina
  yPosition += 25;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Gracias por tu compra. Presenta este comprobante al retirar tu pedido.', 20, yPosition);
  
  yPosition += 6;
  doc.text('Kiosco Escolar - Sistema de Pedidos Online', 20, yPosition);
  
  yPosition += 6;
  doc.text(`Generado el: ${new Date().toLocaleString('es-AR')}`, 20, yPosition);
  
  // Seccion de codigo QR eliminada segun lo solicitado
  
  // Guardar el PDF con nombre de archivo apropiado
  doc.save(`comprobante-${order.id}.pdf`);
}