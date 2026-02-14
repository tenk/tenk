import { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Building2, 
  ArrowRight,
  ExternalLink,
  Info,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Omnibus Guide Content
const OMNIBUS_GUIDE_SECTIONS = [
  {
    id: 'overview',
    title: 'What Changed in January 2024?',
    icon: Info,
    content: `
      The Korean government abolished the Integrated Registration Code (IRC) requirement for foreign investors,
      replacing it with a streamlined Omnibus Account structure. This is the most significant regulatory
      change for foreign KOSPI/KOSDAQ investors in 30 years.
      
      Key Benefits:
      • No more 5-day registration delays - trade instantly
      • Reduced documentation burden
      • Simplified tax reporting
      • Direct market access through global brokerages
    `
  },
  {
    id: 'setup',
    title: 'Setting Up Your Omnibus Account',
    icon: Building2,
    content: `
      Step 1: Verify your brokerage supports Korean omnibus accounts
      Step 2: Complete the omnibus account agreement
      Step 3: Submit KYC documents (passport, proof of address)
      Step 4: Wait for account activation (typically 1-2 business days)
      Step 5: Fund your account and start trading
      
      Required Documents:
      • Valid passport
      • Proof of residence (utility bill, bank statement)
      • W-8BEN form (for US tax purposes)
      • Brokerage account application
    `
  },
  {
    id: 'tax',
    title: 'Tax Implications',
    icon: TrendingUp,
    content: `
      Dividend Tax: 22% withholding for non-residents
      Capital Gains: Currently exempt for most foreign investors
      Tax Treaties: Rates may vary based on your country's treaty with Korea
      
      Important: The omnibus structure simplifies tax reporting but does not eliminate
      your obligation to report foreign income in your home jurisdiction.
      
      Consult a tax professional familiar with cross-border investments.
    `
  },
  {
    id: 'reporting',
    title: 'Reporting Requirements',
    icon: Shield,
    content: `
      The omnibus account consolidates all your Korean holdings under a single structure,
      significantly reducing the reporting burden.
      
      What Changed:
      • No individual stock registration required
      • Broker handles most KRX reporting
      • Simplified year-end tax documents
      • Automatic dividend tax withholding
      
      You Still Need To:
      • Report foreign accounts (FBAR/FATCA for US persons)
      • Declare investment income in your tax return
      • Maintain records of transactions
    `
  }
];

// Mock Disclosure Feed
const MOCK_DISCLOSURES = [
  {
    id: '1',
    company: 'Samsung Electronics',
    ticker: '005930.KS',
    title: 'Q4 2024 Earnings Release',
    date: '2024-01-31',
    type: 'Earnings',
    isTranslated: true,
    originalLanguage: 'Korean',
  },
  {
    id: '2',
    company: 'SK Hynix',
    ticker: '000660.KS',
    title: 'HBM3E Supply Agreement with NVIDIA',
    date: '2024-01-29',
    type: 'Material Contract',
    isTranslated: true,
    originalLanguage: 'Korean',
  },
  {
    id: '3',
    company: 'Hyundai Motor',
    ticker: '005380.KS',
    title: 'Georgia EV Plant Production Update',
    date: '2024-01-28',
    type: 'Business Update',
    isTranslated: false,
    originalLanguage: 'English',
  },
  {
    id: '4',
    company: 'LG Energy Solution',
    ticker: '373220.KS',
    title: 'Battery Supply Agreement Expansion',
    date: '2024-01-26',
    type: 'Material Contract',
    isTranslated: true,
    originalLanguage: 'Korean',
  },
  {
    id: '5',
    company: 'Naver Corp',
    ticker: '035420.KS',
    title: 'Webtoon Entertainment IPO Filing',
    date: '2024-01-25',
    type: 'SEC Filing',
    isTranslated: false,
    originalLanguage: 'English',
  },
];

// Brokerage Support Data
const BROKERAGE_DATA = [
  {
    name: 'Interactive Brokers',
    supported: true,
    notes: 'Full omnibus support via IBKR Global',
    setupTime: '2-3 business days',
    fees: 'Low - $0.0035/share',
  },
  {
    name: 'Fidelity',
    supported: true,
    notes: 'International trading enabled',
    setupTime: '3-5 business days',
    fees: 'Moderate - $19.95/trade',
  },
  {
    name: 'Charles Schwab',
    supported: true,
    notes: 'Global Account required',
    setupTime: '5-7 business days',
    fees: 'Moderate - $19.95/trade',
  },
  {
    name: 'TD Ameritrade',
    supported: false,
    notes: 'No direct Korea access - use Schwab',
    setupTime: 'N/A',
    fees: 'N/A',
  },
  {
    name: 'E*Trade',
    supported: false,
    notes: 'Limited international markets',
    setupTime: 'N/A',
    fees: 'N/A',
  },
  {
    name: 'Tiger Brokers',
    supported: true,
    notes: 'Asia-focused, good for China/Korea',
    setupTime: '1-2 business days',
    fees: 'Low - 0.03% commission',
  },
];

function OmnibusGuide() {
  const [activeSection, setActiveSection] = useState('overview');
  
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0 space-y-1">
          {OMNIBUS_GUIDE_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors',
                activeSection === section.id
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <section.icon className="w-4 h-4" />
              {section.title}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          {OMNIBUS_GUIDE_SECTIONS.map((section) => (
            activeSection === section.id && (
              <Card key={section.id} className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <section.icon className="w-5 h-5 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert prose-sm max-w-none">
                    {section.content.split('\n').map((line, i) => (
                      <p key={i} className={cn(
                        'text-muted-foreground',
                        line.startsWith('Step') || line.startsWith('•') ? 'ml-0' : ''
                      )}>
                        {line.trim()}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

function DisclosureFeed() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Latest KRX disclosures with AI translation
        </p>
        <Badge variant="outline" className="text-xs">
          <Globe className="w-3 h-3 mr-1" />
          Auto-Translated
        </Badge>
      </div>
      
      {MOCK_DISCLOSURES.map((disclosure) => (
        <Card key={disclosure.id} className="glass-card hover:border-primary/30 transition-colors cursor-pointer group">
          <CardContent className="p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary">${disclosure.ticker}</span>
                  <span className="text-xs text-muted-foreground">{disclosure.company}</span>
                  {disclosure.isTranslated && (
                    <Badge variant="secondary" className="text-[10px] px-1 py-0">
                      AI Translated
                    </Badge>
                  )}
                </div>
                <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {disclosure.title}
                </h4>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-muted-foreground">{disclosure.date}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {disclosure.type}
                  </Badge>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button variant="ghost" className="w-full text-sm">
        View All Disclosures
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}

function BrokerageChecker() {
  const filteredBrokerages = BROKERAGE_DATA;
  
  return (
    <div className="space-y-4">
      <Card className="glass-card border-amber-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-400">Important Notice</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Support for Korean omnibus accounts varies by brokerage and your country of residence.
                Always verify directly with your broker before making investment decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        {filteredBrokerages.map((broker) => (
          <Card key={broker.name} className={cn(
            'glass-card',
            broker.supported ? 'border-emerald-500/20' : 'border-red-500/20'
          )}>
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {broker.supported ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <div>
                    <h4 className="text-sm font-medium">{broker.name}</h4>
                    <p className="text-xs text-muted-foreground">{broker.notes}</p>
                    {broker.supported && (
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {broker.setupTime}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {broker.fees}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge 
                  variant={broker.supported ? 'default' : 'secondary'}
                  className={cn(
                    'text-xs',
                    broker.supported && 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  )}
                >
                  {broker.supported ? 'Supported' : 'Not Supported'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function InvestorGateway() {
  return (
    <Card className="glass-card border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Globe className="w-5 h-5 text-primary" />
              Investor Gateway
            </CardTitle>
            <CardDescription className="mt-1">
              Everything foreign investors need to know about Korean markets
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
            January 2024 Regulations
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="guide" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="guide" className="text-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Omnibus Guide
            </TabsTrigger>
            <TabsTrigger value="disclosures" className="text-sm">
              <FileText className="w-4 h-4 mr-2" />
              Disclosures
            </TabsTrigger>
            <TabsTrigger value="brokerage" className="text-sm">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Broker Check
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guide" className="mt-0">
            <OmnibusGuide />
          </TabsContent>
          
          <TabsContent value="disclosures" className="mt-0">
            <DisclosureFeed />
          </TabsContent>
          
          <TabsContent value="brokerage" className="mt-0">
            <BrokerageChecker />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
