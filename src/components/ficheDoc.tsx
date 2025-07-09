import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';
import { ProductSheet } from './ProductSheetGenerator';


// Style
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 4,
    textDecoration: 'underline',
  },
  listItem: {
    marginLeft: 10,
    marginBottom: 2,
  },
  cta: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#1a73e8',
  },
  tag: {
    marginRight: 6,
    padding: 3,
    borderRadius: 3,
    backgroundColor: '#f0f0f0',
    fontSize: 10,
    // Removed invalid display property
  },
});

// Document Component
const ProductPDF: React.FC<{ data: ProductSheet }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Titre */}
      <View style={styles.section}>
        <Text style={styles.title}>{data.title}</Text>
        <Text>Category : {data.category}</Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Description</Text>
        <Text>{data.description}</Text>
      </View>

      {/* Caractéristiques */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Features</Text>
        {data.features.map((feature, index) => (
          <Text key={index} style={styles.listItem}>• {feature}</Text>
        ))}
      </View>

      {/* Bénéfices */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Benefits</Text>
        {data.benefits.map((benefit, index) => (
          <Text key={index} style={styles.listItem}>✓ {benefit}</Text>
        ))}
      </View>

      {/* Prix suggéré */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Suggested price</Text>
        <Text>{data.priceSuggestion}</Text>
      </View>

      {/* Mots-clés SEO */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>SEO Tags</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {data.seoTags.map((tag, index) => (
            <Text key={index} style={styles.tag}>#{tag}</Text>
          ))}
        </View>
      </View>

      {/* Call to Action */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Call to Action</Text>
        <Text style={styles.cta}>{data.cta}</Text>
      </View>
    </Page>
  </Document>
);

export default ProductPDF;
