import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Modal 
} from 'react-native';

interface AboutScreenProps {
  visible: boolean;
  onClose: () => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={require('../../assets/task-app-banner.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Gerenciador de Tarefas</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o App</Text>
          <Text style={styles.paragraph}>
            Este aplicativo foi desenvolvido como parte de um simulado para a disciplina de Desenvolvimento Mobile. 
            O objetivo principal é oferecer uma ferramenta simples e eficiente para o gerenciamento de tarefas diárias, 
            permitindo que os usuários organizem suas atividades de forma clara e intuitiva.
          </Text>
          <Text style={styles.paragraph}>
            Com uma interface moderna e responsiva, o Gerenciador de Tarefas utiliza as melhores práticas de 
            desenvolvimento com React Native e Expo. A aplicação foca na usabilidade, garantindo que o usuário 
            possa adicionar, editar e remover tarefas com poucos toques na tela.
          </Text>
          <Text style={styles.paragraph}>
            Acreditamos que a organização é a chave para a produtividade. Por isso, este projeto busca 
            integrar funcionalidades essenciais, como filtros por status e prioridade, além de uma 
            visualização clara de prazos, ajudando você a nunca mais esquecer um compromisso importante.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tecnologias Utilizadas</Text>
          <View style={styles.techList}>
            <Text style={styles.techItem}>• React Native</Text>
            <Text style={styles.techItem}>• Expo</Text>
            <Text style={styles.techItem}>• TypeScript</Text>
            <Text style={styles.techItem}>• EAS (Expo Application Services)</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 15,
    textAlign: 'justify',
  },
  techList: {
    marginLeft: 10,
  },
  techItem: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AboutScreen;
