import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Dialog from "react-native-dialog";

const DialogVenta = ({ tipo, estado, handleButton }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [text, setText] = useState('');

  //CAMBIA EL TITULO Y DESCRIPCION DEPENDIENDO DEL TIPO
  useEffect(() => {
    (() => {
      if (tipo === "COMENTARIO") {
        setDesc("Ingrese un comentario.");
        setTitle("Comentario");
      }
      if (tipo === "FOLIO") {
        setTitle("ADVERTENCIA");
        setDesc("Ingrese un folio valido.");
      }
      if (tipo === "PRINT") {
        setTitle("TICKET");
        setDesc("Por favor indique la cantidad de copias");
      }
    })();
  }, [estado]);

  return (
    <Dialog.Container visible={estado}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{desc}</Dialog.Description>
      <Dialog.Input
        onChangeText={(text) => setText(text)}
        label={tipo}
        underlineColorAndroid="black"
        keyboardType={tipo === "PRINT" ? "numeric" : "default"}
      />
      <Dialog.Button label="Aceptar" onPress={() => handleButton(text, tipo)} />
    </Dialog.Container>
  );
};

const styles = StyleSheet.create({});

export default DialogVenta;
