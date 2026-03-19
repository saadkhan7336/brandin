import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { 
  Shield, 
  ChevronDown, 
  Search, 
  Target, 
  TrendingUp, 
  Award, 
  Users, 
  Briefcase, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Menu, 
  X, 
  ChevronRight 
} from 'lucide-react';
import InfluBtn from './../common/InfluBtn';
import { useSelector } from 'react-redux';


function LandingNavbar() {
const navigate=useNavigate();

const {isAuthenticated,user} =useSelector((state)=>state.auth);
const isAuth=isAuthenticated && user;

const [openDropdown,setOpenDropdown]=useState(null);
const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);






  return (
    <div>
      
    </div>
  )
}

export default LandingNavbar
