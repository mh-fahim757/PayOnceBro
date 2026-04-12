import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

const StatCard = ({ label, value, helper }) => {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl font-bold tracking-tight">{value}</CardTitle>
      </CardHeader>
      {helper ? (
        <CardContent>
          <p className="text-xs text-muted-foreground">{helper}</p>
        </CardContent>
      ) : null}
    </Card>
  )
}

export default StatCard
