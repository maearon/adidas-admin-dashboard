"use client"

import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { SearchIcon, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { EnhancedSearchAutocomplete } from "./enhanced-search-autocomplete"

interface EnhancedSearchFieldProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
  variant?: "header" | "page"
}

export function EnhancedSearchField({
  onSearch,
  placeholder = "Search",
  className = "",
  autoFocus = false,
  variant = "page",
}: EnhancedSearchFieldProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchText, setSearchText] = useState(searchParams.get("q") || "")
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const query = searchText.trim()
    if (!query) return

    setShowAutocomplete(false)

    if (onSearch) {
      onSearch(query)
    } else {
      router.push(`/admin/products?q=${encodeURIComponent(query)}`)
    }
  }

  function clearInput() {
    setSearchText("")
    setShowAutocomplete(false)
    if (onSearch) {
      onSearch("")
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchText(value)
    setShowAutocomplete(value.length > 0)
  }

  function handleFocus() {
    if (searchText.length > 0) {
      setShowAutocomplete(true)
    }
  }

  function handleBlur() {
    setTimeout(() => setShowAutocomplete(false), 200)
  }

  const inputClasses =
    variant === "header"
      ? "bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20 focus:border-white"
      : "bg-background border-2 border-foreground placeholder-muted-foreground focus:ring-2 focus:ring-foreground"

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          name="q"
          value={searchText}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`
            pe-10 
            focus:placeholder-transparent 
            text-sm 
            pl-3
            pr-10 
            py-2
            focus:outline-none
            ${inputClasses}
          `}
        />

        {searchText ? (
          <X
            className={`absolute right-3 top-1/2 size-4 -translate-y-1/2 cursor-pointer hover:opacity-70 ${
              variant === "header" ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={clearInput}
          />
        ) : (
          <SearchIcon
            className={`absolute right-3 top-1/2 size-4 -translate-y-1/2 ${
              variant === "header" ? "text-white/70" : "text-muted-foreground"
            }`}
          />
        )}
      </div>

      {showAutocomplete && searchText && (
        <EnhancedSearchAutocomplete
          keyword={searchText}
          onSelect={(query) => {
            setSearchText(query)
            setShowAutocomplete(false)
            if (onSearch) {
              onSearch(query)
            } else {
              router.push(`/admin/products?q=${encodeURIComponent(query)}`)
            }
          }}
        />
      )}
    </form>
  )
}
