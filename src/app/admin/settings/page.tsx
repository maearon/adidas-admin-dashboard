"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdidasButton } from "@/components/ui/adidas-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Store, Bell, Shield, Palette, Truck, CreditCard, Save, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: "Adidas Vietnam",
    storeDescription: "Official Adidas store in Vietnam",
    storeEmail: "admin@adidas.vn",
    storePhone: "+84 28 1234 5678",
    storeAddress: "123 Nguyen Hue, District 1, Ho Chi Minh City",

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderNotifications: true,
    inventoryAlerts: true,

    // Appearance
    theme: "light",
    language: "vi",
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",

    // Security
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",

    // Shipping
    freeShippingThreshold: 500000,
    standardShippingCost: 30000,
    expressShippingCost: 50000,

    // Payment
    paymentMethods: ["credit_card", "bank_transfer", "cod"],
    autoRefund: true,
    refundPeriod: "14",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log("Saving settings:", settings)
    // Here you would typically send the settings to your API
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">Settings</h1>
          <p className="text-muted-foreground">Manage your store configuration and preferences.</p>
        </div>
        <div className="flex gap-2">
          <AdidasButton className="border-2 border-foreground">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </AdidasButton>
          <AdidasButton onClick={handleSave} className="border-2 border-foreground">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </AdidasButton>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 border-2 border-foreground">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="uppercase tracking-wide">Store Information</CardTitle>
              <CardDescription>Basic information about your store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => handleSettingChange("storeName", e.target.value)}
                    className="border-2 border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => handleSettingChange("storeEmail", e.target.value)}
                    className="border-2 border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Store Phone</Label>
                  <Input
                    id="storePhone"
                    value={settings.storePhone}
                    onChange={(e) => handleSettingChange("storePhone", e.target.value)}
                    className="border-2 border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Input
                    id="storeAddress"
                    value={settings.storeAddress}
                    onChange={(e) => handleSettingChange("storeAddress", e.target.value)}
                    className="border-2 border-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  value={settings.storeDescription}
                  onChange={(e) => handleSettingChange("storeDescription", e.target.value)}
                  className="border-2 border-foreground"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="uppercase tracking-wide">Notification Preferences</CardTitle>
              <CardDescription>Configure how you want to receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderNotifications">Order Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new orders</p>
                  </div>
                  <Switch
                    id="orderNotifications"
                    checked={settings.orderNotifications}
                    onCheckedChange={(checked) => handleSettingChange("orderNotifications", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inventoryAlerts">Inventory Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get alerts for low stock items</p>
                  </div>
                  <Switch
                    id="inventoryAlerts"
                    checked={settings.inventoryAlerts}
                    onCheckedChange={(checked) => handleSettingChange("inventoryAlerts", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="uppercase tracking-wide">Appearance & Localization</CardTitle>
              <CardDescription>Customize the look and feel of your admin panel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                    <SelectTrigger className="border-2 border-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-foreground">
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                    <SelectTrigger className="border-2 border-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-foreground">
                      <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="zh">🇨🇳 中文</SelectItem>
                      <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => handleSettingChange("currency", value)}>
                    <SelectTrigger className="border-2 border-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-foreground">
                      <SelectItem value="VND">VND (₫)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                    <SelectTrigger className="border-2 border-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-foreground">
                      <SelectItem value="Asia/Ho_Chi_Minh">Ho Chi Minh (GMT+7)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="uppercase tracking-wide">Security Settings</CardTitle>
              <CardDescription>Configure security and authentication settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange("sessionTimeout", e.target.value)}
                      className="border-2 border-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      value={settings.passwordExpiry}
                      onChange={(e) => handleSettingChange("passwordExpiry", e.target.value)}
                      className="border-2 border-foreground"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="uppercase tracking-wide">Shipping Configuration</CardTitle>
              <CardDescription>Configure shipping rates and policies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (VND)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => handleSettingChange("freeShippingThreshold", Number.parseInt(e.target.value))}
                    className="border-2 border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="standardShippingCost">Standard Shipping Cost (VND)</Label>
                  <Input
                    id="standardShippingCost"
                    type="number"
                    value={settings.standardShippingCost}
                    onChange={(e) => handleSettingChange("standardShippingCost", Number.parseInt(e.target.value))}
                    className="border-2 border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expressShippingCost">Express Shipping Cost (VND)</Label>
                  <Input
                    id="expressShippingCost"
                    type="number"
                    value={settings.expressShippingCost}
                    onChange={(e) => handleSettingChange("expressShippingCost", Number.parseInt(e.target.value))}
                    className="border-2 border-foreground"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card className="border-2 border-foreground">
            <CardHeader>
              <CardTitle className="uppercase tracking-wide">Payment Configuration</CardTitle>
              <CardDescription>Configure payment methods and policies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoRefund">Automatic Refunds</Label>
                    <p className="text-sm text-muted-foreground">Automatically process refunds for cancelled orders</p>
                  </div>
                  <Switch
                    id="autoRefund"
                    checked={settings.autoRefund}
                    onCheckedChange={(checked) => handleSettingChange("autoRefund", checked)}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="refundPeriod">Refund Period (days)</Label>
                  <Input
                    id="refundPeriod"
                    type="number"
                    value={settings.refundPeriod}
                    onChange={(e) => handleSettingChange("refundPeriod", e.target.value)}
                    className="border-2 border-foreground max-w-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
