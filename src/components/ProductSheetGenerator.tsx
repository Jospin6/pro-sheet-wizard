import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Copy, Download, RefreshCw, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { generateFiche } from '@/lib/generate_fiche';
import { DownLoadPdf } from '@/lib/downloadPdf';
import ProductPDF from './ficheDoc';

export interface ProductSheet {
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  priceSuggestion: string;
  seoTags: string[];
  category: string;
  cta: string;
  translations?: {
    fr: any;
    en: any;
  };
}

export const ProductSheetGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [productSheet, setProductSheet] = useState<ProductSheet | null>(null);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    targetAudience: '',
    language: 'fr'
  });
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const handleGenerate = async () => {
    if (!formData.productName.trim()) {
      toast({
        title: "Error",
        description: "Please enter the product name",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Simulation de génération IA (à remplacer par l'API réelle)
    setTimeout(async () => {
      const inputPrompt = `${formData.productName}${formData.description ? `: ${formData.description}` : ""}${formData.targetAudience ? ` (Target public: ${formData.targetAudience})` : ""} [Language: ${formData.language}]`;
      const mockSheet: ProductSheet = await generateFiche(inputPrompt);

      // Sauvegarder dans Supabase
      if (user) {
        try {
          const { error } = await supabase
            .from('product_sheets')
            .insert({
              user_id: user.id,
              product_input_name: formData.productName,
              generated_title: mockSheet.title,
              description: mockSheet.description,
              features: mockSheet.features,
              benefits: mockSheet.benefits,
              price_suggestion: mockSheet.priceSuggestion,
              seo_tags: mockSheet.seoTags,
              category: mockSheet.category,
              cta: mockSheet.cta,
              translations: mockSheet.translations
            });

          if (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            toast({
              title: "Save error",
              description: "The product sheet was generated but could not be saved",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Erreur lors de la sauvegarde:', error);
        }
      }

      setProductSheet(mockSheet);
      setIsGenerating(false);

      toast({
        title: "Product sheet generated!",
        description: "Your product sheet has been successfully created",
      });
    }, 2000);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied !",
        description: "Content has been copied to the clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Unable to copy content",
        variant: "destructive"
      });
    }
  };

  const exportAsJSON = () => {
    if (!productSheet) return;

    const dataStr = JSON.stringify(productSheet, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `fiche-produit-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Export successful!",
      description: "The product sheet has been exported as JSON",
    });
  };

  const onClickDownload = (data: ProductSheet) => {
    DownLoadPdf({
      pdfElement: <ProductPDF data={data} />,
      filename: `product_sheet.pdf`,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logout",
      description: "You have been successfully logged out",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-4xl font-bold">
              QwickFiche
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Wellcome, {user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate professional product sheets in seconds using artificial intelligence.
          </p>
        </div>


        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                Create a product sheet
              </CardTitle>
              <CardDescription className="text-blue-100">
                Enter the basic information to generate your product sheet
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productName" className="text-sm font-medium">
                  Product name *
                </Label>
                <Input
                  id="productName"
                  placeholder="e.g., Women's running shoes"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief product description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-sm font-medium">
                  Target audience
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Young professionals, Athletes, Parents..."
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium">
                  Output language
                </Label>
                <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
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
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate product sheet
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <span>Product sheet generated</span>
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
                      <Download className="h-4 w-4" /> JSON
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onClickDownload(productSheet)}
                      className="text-white hover:bg-white/20"
                    >
                      <Download className="h-4 w-4" /> PDF
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription className="text-green-100">
                {productSheet ? "AI generation result" : "Results will appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {!productSheet ? (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Fill out the form and click "Generate" to see your product sheet appear</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">SEO-optimized title</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{productSheet.title}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">Marketing description</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed">{productSheet.description}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">Features</h3>
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
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">Benefits</h3>
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
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">Suggested price</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{productSheet.priceSuggestion}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">Category</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{productSheet.category}</p>
                    </div>
                  </div>

                  {/* SEO Tags */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">SEO Tags</h3>
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
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">Call-to-Action</h3>
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
          <p>Generate professional product sheets in just a few clicks</p>
        </div>
      </div>
    </div>
  );
};
