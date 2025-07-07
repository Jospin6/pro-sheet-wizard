
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Copy, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductSheet {
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  priceSuggestion: string;
  seoTags: string[];
  category: string;
  cta: string;
  translations: {
    fr: any;
    en: any;
  };
}

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [productSheet, setProductSheet] = useState<ProductSheet | null>(null);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    targetAudience: '',
    language: 'fr'
  });
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.productName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le nom du produit",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulation de génération IA (à remplacer par l'API réelle)
    setTimeout(() => {
      const mockSheet: ProductSheet = {
        title: `${formData.productName} - Premium Edition`,
        description: `Découvrez notre ${formData.productName} conçu spécialement pour ${formData.targetAudience || 'tous les utilisateurs'}. Un produit innovant qui combine qualité, performance et design moderne pour répondre à tous vos besoins.`,
        features: [
          "Matériaux de haute qualité",
          "Design ergonomique et moderne",
          "Compatible avec tous les appareils",
          "Garantie 2 ans incluse",
          "Livraison gratuite"
        ],
        benefits: [
          "Améliore votre productivité au quotidien",
          "Économise du temps et de l'énergie",
          "Design élégant qui s'adapte à tous les environnements",
          "Investissement durable et rentable"
        ],
        priceSuggestion: "49,99€ - 79,99€",
        seoTags: ["premium", "qualité", "innovation", "moderne", "efficace"],
        category: "Électronique & Accessoires",
        cta: "Commandez maintenant - Livraison gratuite",
        translations: {
          fr: "Version française",
          en: "English version"
        }
      };
      
      setProductSheet(mockSheet);
      setIsGenerating(false);
      
      toast({
        title: "Fiche produit générée !",
        description: "Votre fiche produit a été créée avec succès",
      });
    }, 2000);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: "Le contenu a été copié dans le presse-papiers",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le contenu",
        variant: "destructive"
      });
    }
  };

  const exportAsJSON = () => {
    if (!productSheet) return;
    
    const dataStr = JSON.stringify(productSheet, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `fiche-produit-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export réussi !",
      description: "La fiche produit a été exportée en JSON",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-4xl font-bold mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            ProSheet Wizard
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Générez des fiches produits professionnelles en quelques secondes grâce à l'intelligence artificielle
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Créer une fiche produit
              </CardTitle>
              <CardDescription className="text-blue-100">
                Saisissez les informations de base pour générer votre fiche
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productName" className="text-sm font-medium">
                  Nom du produit *
                </Label>
                <Input
                  id="productName"
                  placeholder="ex: Chaussures de sport pour femme"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description (optionnelle)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brève description du produit..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-sm font-medium">
                  Public cible
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="ex: Jeunes actifs, Sportifs, Parents..."
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium">
                  Langue de sortie
                </Label>
                <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer la fiche produit
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <span>Fiche produit générée</span>
                {productSheet && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(productSheet, null, 2))}
                      className="text-white hover:bg-white/20"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={exportAsJSON}
                      className="text-white hover:bg-white/20"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription className="text-green-100">
                {productSheet ? "Résultat de la génération IA" : "Les résultats apparaîtront ici"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {!productSheet ? (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Complétez le formulaire et cliquez sur "Générer" pour voir apparaître votre fiche produit</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">📝 Titre optimisé SEO</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{productSheet.title}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">📄 Description marketing</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed">{productSheet.description}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">⚙️ Caractéristiques</h3>
                    <ul className="space-y-1 bg-gray-50 p-3 rounded-lg">
                      {productSheet.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">✨ Avantages</h3>
                    <ul className="space-y-1 bg-gray-50 p-3 rounded-lg">
                      {productSheet.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">💰 Prix suggéré</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{productSheet.priceSuggestion}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">📁 Catégorie</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{productSheet.category}</p>
                    </div>
                  </div>

                  {/* SEO Tags */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">🏷️ Tags SEO</h3>
                    <div className="flex flex-wrap gap-2">
                      {productSheet.seoTags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">🎯 Call-to-Action</h3>
                    <p className="text-gray-700 bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-lg font-medium">
                      {productSheet.cta}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>💡 Propulsé par l'IA - Générez des fiches produits professionnelles en quelques clics</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
